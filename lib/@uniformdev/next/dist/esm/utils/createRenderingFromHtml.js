import React from 'react';
import { throwException } from '@uniformdev/common';
import { getDefaultProcessingInstructions } from '.';
var HtmlToReact = require('html-to-react');
var HtmlToReactParser = require('html-to-react').Parser;
var preprocessingInstructions = [
    {
        shouldPreprocessNode: function (node) {
            return (node.name === 'a' &&
                node.attribs &&
                node.attribs.href &&
                !node.attribs.href.startsWith('http') &&
                node.attribs.href !== '#');
        },
        preprocessNode: function (node) {
            var href = node.attribs && node.attribs.href;
            if (href) {
                // appending trailing slash
                if (href.substr(-1) != '/')
                    href += '/';
                node.attribs.href = href.toLowerCase();
            }
        },
    },
];
//@ts-ignore
export function createRenderingFromHtml(html, renderingContext, r, placeholderKey, index, components, _config, logger, options) {
    var _a;
    logger.debug('Rendering component ' + r.componentName + ' from html in ' + placeholderKey + ' placeholder');
    var placeholderComponent = components.Placeholder || throwException('no components.Placeholder');
    // TODO: xml tag before <svg /> breaks pasing.
    // more replacements may be needed and refactored into a replacement function
    var cleanedupHtml = html.replace('<?xml version="1.0" encoding="utf-8"?><svg', '<svg');
    var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
    var processingInstructions = undefined || ((_a = options === null || options === void 0 ? void 0 : options.mvc) === null || _a === void 0 ? void 0 : _a.getProcessingInstructions(processNodeDefinitions.processDefaultNode, placeholderComponent, r, index, placeholderKey, renderingContext, logger)) ||
        getDefaultProcessingInstructions(processNodeDefinitions.processDefaultNode, placeholderComponent, r, index, placeholderKey, renderingContext, logger) ||
        throwException('processingInstructions');
    var rendered = new HtmlToReactParser().parseWithInstructions(cleanedupHtml, function () { return true; }, processingInstructions, preprocessingInstructions);
    logger.debug('Rendering component ' + r.componentName + ' from html');
    return rendered;
}
//# sourceMappingURL=createRenderingFromHtml.js.map