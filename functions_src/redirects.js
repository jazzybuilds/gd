const { pageNotFound } = require('./404.html.json');
const redirects = require('./redirects.json');
const { cleanFromUrl, getRedirectURL } = require('../lib/helpers/redirect-url-parser.js');


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

  const target = getRedirectURL(path, redirects)
  if (target) {
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
