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
import { buildLinkTag } from './html/buildLinkTag';
import { buildPlaceholder } from './html/buildPlaceholder';
import { buildScriptTag } from './html/buildScriptTag';
export function getDefaultProcessingInstructions(processDefaultNode, placeholderComponent, r, index, placeholderKey, renderingContext, logger) {
    return [
        {
            shouldProcessNode: function (node) {
                return node.name === 'input' && Object.keys(node.attribs).includes('checked');
            },
            processNode: function (node) {
                //console.log("processing input with 'checked' attribute");
                var newAttrs = __assign({}, node.attribs);
                var checked = Object.keys(node.attribs).includes('checked');
                if (checked) {
                    // removing the original value
                    delete newAttrs.checked;
                    // setting defaultChecked
                    newAttrs['defaultChecked'] = checked;
                }
                return React.createElement(node.name, __assign({}, newAttrs));
            },
        },
        {
            shouldProcessNode: function (node) {
                return node.name === 'input' && node.attribs['value'] !== undefined;
            },
            //@ts-ignore
            processNode: function (node) {
                var inputValue = node.attribs['value'];
                //console.log('processing input id ' + node.attribs["id"] + ' with value attribute = ' + inputValue);
                var newAttrs = __assign({}, node.attribs);
                // removing the original value
                delete newAttrs.value;
                // setting default value
                newAttrs['defaultValue'] = inputValue;
                return React.createElement(node.name, __assign({}, node.attribs));
            },
        },
        // placeholder processing
        buildPlaceholder(placeholderComponent, r, index, placeholderKey, renderingContext, logger),
        // disabling antiforgery token on all forms with action
        {
            shouldProcessNode: function (node) {
                return (node.name === 'form' &&
                    node.attribs.action &&
                    node.attribs.action.startsWith('/formbuilder'));
            },
            //@ts-ignore
            processNode: function (node, children) {
                console.log('processing form with action');
                var newAttrs = __assign({}, node.attribs);
                newAttrs['asp-antiforgery'] = 'false';
                return React.createElement(node.name, __assign({}, newAttrs), children);
            },
        },
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
                return processDefaultNode(node, children, index);
            },
        },
    ];
}
//# sourceMappingURL=getDefaultProcessingInstructions.js.map