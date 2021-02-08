function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function addTrailingSlash(url) {
  const fileMatch = /\.[^?|#]{3,4}(\?|#|$)/gi.test(url)
  if (url === '/' || url.indexOf('&') > -1 || url.indexOf('?') > -1 || fileMatch) {
      return fileMatch ? url : url.replace(/(?<!\/)\?/, '/?').replace(/(?<!\/)#/, '/#');
  }
  return url.endsWith('/') || url.endsWith('/*') ? url : `${url}/`;
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
  return redirects.filter(
    item => new RegExp('^' + item.from.replace(/\*/g, '.*') + '$').test(str)
  );
}

function filterByPlaceholder(str, redirects) {
  return redirects.filter(
    item => new RegExp('^' + item.from.replace("/*", "/").replace(/(\:.*?\/)/gi, '.*') + '$').test(str)
  );
}

function formatPlaceholdeURL(path, from, to) {
  const fromParts = from.split("/")
  const pathParts = path.split("/")
  const toParts = to.split("/")

  const formattedURL = toParts.map((toPart) => {
    if (toPart.startsWith(":")) {
      const fromIndex = fromParts.findIndex(fromPart => fromPart === toPart)
      if (fromIndex >= 0) {
        return pathParts[fromIndex]
      }
      console.error("Unable to parse URL with placeholder properly: ", path)
      return ""
    }
    return toPart
  }).join("/")
  return formattedURL
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
    return a.from.length - b.from.length || a.from.localeCompare(b.from);
  }).pop()
}

function getRedirectURL(path, redirects) {
  const defaultStatus = 301
  const directMatch = redirects.find((redirect) => redirect.from === path)

  if (directMatch) {
    return {
      target: directMatch.to,
      status: directMatch.status || defaultStatus
    }
  }

  const filteredMatches = filterBy(path, redirects)
  
  if (filteredMatches.length > 0) {
    const match = sortItems(filteredMatches)
    return {
      target: formatWildcardURL(path, match.from, match.to),
      status: match.status || defaultStatus
    }
  }

  const filteredPlaceholderMatches = filterByPlaceholder(path, redirects)
  if (filteredPlaceholderMatches.length > 0) {
    const match = sortItems(filteredPlaceholderMatches)
    const target = formatWildcardURL(path, match.from, match.to);
    return {
      target: formatPlaceholdeURL(path, match.from, target),
      status: match.status || defaultStatus
    }
  }

  return null
}

module.exports = { cleanFromUrl, cleanToUrl, filterBy, filterByPlaceholder, formatWildcardURL, formatPlaceholdeURL, getRedirectURL }