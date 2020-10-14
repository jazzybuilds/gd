var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { throwException, } from '@uniformdev/common';
import { buildLinkTag } from './html/buildLinkTag';
import { buildPlaceholder } from './html/buildPlaceholder';
import { buildScriptTag } from './html/buildScriptTag';
import { buildCanonicalLinkTag } from './html/buildCanonicalLinkTag';
var HtmlToReact = require('html-to-react');
var HtmlToReactParser = require('html-to-react').Parser;
//@ts-ignore
export function createRenderingFromHtml(html, renderingContext, r, placeholderKey, index, components, _config, logger) {
    logger.debug('Rendering component ' + r.componentName + ' from html in ' + placeholderKey + ' placeholder');
    var placeholderComponent = components.Placeholder || throwException('no components.Placeholder');
    // TODO: xml tag before <svg /> breaks pasing.
    // more replacements may be needed and refactored into a replacement function
    var cleanedupHtml = html.replace('<?xml version="1.0" encoding="utf-8"?><svg', '<svg');
    var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
    var processingInstructions = [
        // placeholder processing
        buildPlaceholder(placeholderComponent, r, index, placeholderKey, renderingContext, logger),
        // workaround to issue with "html-to-react" https://github.com/aknuds1/html-to-react/issues/43
        {
            replaceChildren: false,
            shouldProcessNode: function (node) {
                return node.name && node.name.indexOf('-') >= 0 && node.attribs && node.attribs['class'];
            },
            processNode: function (node, children, index) {
                if (node.attribs['classname']) {
                    node.attribs['class'] = node.attribs['classname'];
                }
                delete node.attribs.classname;
                return React.createElement(node.name, __assign({ key: index }, node.attribs), children);
            },
        },
        // workaround for react stripping script tags
        buildScriptTag(logger),
        // replace canonical links
        buildCanonicalLinkTag(processNodeDefinitions.processDefaultNode, logger),
        // normalize link tags
        buildLinkTag(logger),
        // TODO: explain why @alexshyba
        {
            // Anything else
            shouldProcessNode: function (_node) {
                return true;
            },
            processNode: function (node, children, index) {
                if (node.attribs) {
                    for (var key in node.attribs) {
                        try {
                            node.attribs[key] = decodeURI(node.attribs[key]);
                        }
                        catch (ex) {
                            logger.debug('ERROR DECODING URI: ' + node.attribs[key]);
                        }
                    }
                }
                return processNodeDefinitions.processDefaultNode(node, children, index);
            },
        },
    ];
    var rendered = new HtmlToReactParser().parseWithInstructions(cleanedupHtml, function () { return true; }, processingInstructions);
    logger.debug('Rendering component ' + r.componentName + ' from html');
    return rendered;
}
//# sourceMappingURL=createRenderingFromHtml.js.map