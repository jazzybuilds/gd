export function getApiUrlWithToken(config, relativePath) {
    var apiUrl = config.UNIFORM_API_URL;
    var uri = new URL(apiUrl.endsWith('/') ? apiUrl : apiUrl + '/');
    if (relativePath) {
        uri = new URL(relativePath.startsWith('.') ? relativePath : '.' + relativePath, uri);
    }
    return uri.href.toLowerCase();
}
//# sourceMappingURL=getApiUrlWithToken.js.map