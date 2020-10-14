import React from 'react';
export function buildScriptTag(logger) {
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
                    return React.createElement('script', scriptProps);
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
                    return React.createElement('script', scriptProps);
                }
            }
            return React.createElement(React.Fragment, undefined);
        },
    };
}
;
//# sourceMappingURL=buildScriptTag.js.map