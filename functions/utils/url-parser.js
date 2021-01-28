function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function addTrailingSlash(url) {
    const fileMatch = /\.[^?|#]{3,4}(\?|#|$)/gi.test(url)
    if (url === '/' || url.indexOf('&') > -1 || url.indexOf('?') > -1 || fileMatch) {
        return fileMatch ? url : url.replace(/(?<!\/)\?/, '/?').replace(/(?<!\/)#/, '/#');
    }
    return url.endsWith('/') ? url : `${url}/`;
}

function cleanToUrl(url) {
    const toUrlParse = url.trim().replace(/http(s)?\:\/\/\{HTTP_HOST\}/gi, '').replace('www.guidedogs.org.uk/', '/').replace('https:///', '/').trim().replace(/\/$/gi, '').replace(/^\//gi, '');
    const toUrl = (toUrlParse ? toUrlParse : '/').replace(/ /gi, '%20');
    return addTrailingSlash(toUrl.startsWith('http') || toUrl === '/' ? toUrl : `/${toUrl}`.toLowerCase());
}

function cleanFromUrl(url) {
    url = url.trim().replace(/^\^/ig, '').replace(/^\//ig, '').replace(/\\\./ig, '.').replace(/\/$/ig, '');
    if (url.match(escapeRegex('(/)?$'))) {
        return addTrailingSlash(`/${url.replace('(/)?$', '')}`.trim().replace(/ /gi, '%20'));
    } else if (url.match(escapeRegex('$'))) {
        return addTrailingSlash(`/${url.replace('$', '')}`.trim().replace(/ /gi, '%20'));
    }
    return addTrailingSlash(`/${url.trim().replace(/ /gi, '%20')}`.toLowerCase());
}

module.exports = { cleanFromUrl, cleanToUrl }