export function buildCanonicalLinkTag(processDefaultNode, _logger) {
    return {
        replaceChildren: false,
        shouldProcessNode: function (node) {
            return (node.name && node.name === 'link' && node.attribs && node.attribs['rel'] === 'canonical');
        },
        // TODO: extract feature
        processNode: function (node, children, index) {
            if (node.attribs && node.attribs['href']) {
                try {
                    var oldUrl = node.attribs['href'];
                    var url = new URL(oldUrl);
                    url.hostname = 'guidedogsuniformpoc.netlify.app/';
                    node.attribs['href'] = url.href;
                }
                catch (ex) {
                    console.error('ERROR replacing canonical url');
                }
            }
            return processDefaultNode(node, children, index);
        },
    };
}
//# sourceMappingURL=buildCanonicalLinkTag.js.map