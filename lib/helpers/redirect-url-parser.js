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

function filterBy(str, redirects) {
  return Object.keys(redirects).filter(
    item => new RegExp('^' + item.replace(/\*/g, '.*') + '$').test(str)
  );
}

function filterByPlaceholder(str, redirects) {
  return Object.keys(redirects).filter(
    item => new RegExp('^' + item.replace("/*", "/").replace(/(\:.*?\/)/gi, '.*') + '$').test(str)
  );
}

function formatPlaceholdeURL(path, from, to) {
  const matchFrom = /(\:.*?\/)/gi.exec(from);
  const pathIndex = path.substring(matchFrom.index, path.indexOf('/', matchFrom.index)); 
  const formatted = to.replace(/(\:.*?\/)/gi, `${pathIndex}/`)
  return formatted
}

function formatWildcardURL(path, from, to) {
  if (!to.includes("*")) {
    return to
  }

  let formattedFromURL = from
  if (formattedFromURL.includes("/:")) {
    formattedFromURL = formatPlaceholdeURL(path, from , from)
  }

  const fromSubset = formattedFromURL.substr(0, formattedFromURL.indexOf('*')); 
  const nestedPath = path.replace(fromSubset, '');
  const formattedUrl = to.replace("*", nestedPath)
  return formattedUrl
}

function sortItems(items) {
  return items.sort(function (a, b) {
    return a.length - b.length || a.localeCompare(b);
  }).pop()
}

function getRedirectURL(path, redirects) {
  if (redirects[path]) {
    return redirects[path]
  }

  const filteredMatches = filterBy(path, redirects)
  
  if (filteredMatches.length > 0) {
    const match = sortItems(filteredMatches)
    const target = redirects[match];
    return formatWildcardURL(path, match, target)
  }

  const filteredPlaceholderMatches = filterByPlaceholder(path, redirects)
  
  if (filteredPlaceholderMatches.length > 0) {
    const match = sortItems(filteredPlaceholderMatches)
    const target = formatWildcardURL(path, match, redirects[match]);
    return formatPlaceholdeURL(path, match, target)
  }

  return null
}

module.exports = { cleanFromUrl, cleanToUrl, filterBy, filterByPlaceholder, formatWildcardURL, formatPlaceholdeURL, getRedirectURL }