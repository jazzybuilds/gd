const { pageNotFound } = require('./404.html.json');
const redirects = require('./redirects.json');
const { cleanFromUrl } = require('./functions/utils/url-parser.js');

function addTrailingSlash(url) {
  if (url === '/' || url.indexOf('&') > -1 || url.indexOf('?') > -1 || /\.[^?|#]{3,4}(\?|#|$)/gi.test(url)) {
    return url;
  }
  return url.endsWith('/') ? url : `${url}/`;
}

const filterBy = str => Object.keys(redirects).filter(
  item => new RegExp('^' + item.replace(/\*/g, '.*') + '$').test(str)
);

exports.handler = async function (event, context) {
  const path = cleanFromUrl(event.path);
  if (path.startsWith('/.netlify/')) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(redirects),
    };
  }

  if (redirects[path]) {
    const target = redirects[path];
    return {
      statusCode: 301,
      headers: {
        location: target,
      },
    };
  }

  const matches = filterBy(path)
  if (matches.length > 0) {
    const match = matches.sort(function (a, b) {
      return a.length - b.length || a.localeCompare(b);
    }).pop()
    const target = redirects[match];
    return {
      statusCode: 301,
      headers: {
        location: target,
      },
    };
  }

  return {
    statusCode: 404,
    headers: {
      "Content-Type": "text/html"
    },
    body: pageNotFound,
    isBase64Encoded: true,
  };

};
