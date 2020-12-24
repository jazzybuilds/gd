"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildScriptTag = void 0;
var react_1 = __importDefault(require("react"));
function buildScriptTag(logger) {
    return {
        // this is important to keep to `false` otherwise script tags will be wrapped in script tags
        replaceChildren: false,
        shouldProcessNode: function (node) {
            return node.name && node.name === 'script';
        },
        processNode: function (node, _children, index) {
            var async = node.attribs.async !== undefined ? 'async' : '';
            var src = node.attribs.src;
            if (src && src.startsWith('-/media/')) {
                src = src.replace('-/media/', '/-/media/');
            }
            var type = node.attribs.type;
            if (src || node.children.length === 1) {
                logger.debug('Adding script ' + src + ' ' + async);
                if (src) {
                    var scriptProps = {
                        key: src,
                        src: src,
                        type: type,
                    };
                    if (async) {
                        scriptProps.async = '';
                    }
                    return react_1.default.createElement('script', scriptProps);
                }
                else {
                    var scriptProps = {
                        key: 'nosrc' + index,
                        index: index,
                        type: type,
                        dangerouslySetInnerHTML: {
                            __html: node.children[0].data || '',
                        },
                    };
                    if (async) {
                        scriptProps.async = '';
                    }
                    if (node.attribs.class) {
                        scriptProps.className = node.attribs.class;
                    }
                    return react_1.default.createElement('script', scriptProps);
                }
            }
            return react_1.default.createElement(react_1.default.Fragment, undefined);
        },
    };
}
exports.buildScriptTag = buildScriptTag;
;
//# sourceMappingURL=buildScriptTag.js.map