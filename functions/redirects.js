const { pageNotFound } = require('./404.html.json');
const redirects = require('./redirects.json');

exports.handler = async function (event, context) {
  const path = event.path.toLowerCase();
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

  return {
    statusCode: 404,
    headers: {
      "Content-Type": "text/html"
    },
    body: pageNotFound,
    isBase64Encoded: true,
  };

};
