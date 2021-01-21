const { pageNotFound } = require('./404.html.json');
const redirects = require('./redirects.json');

exports.handler = async function (event, context) {
  const path = event.path.toLowerCase();
  if (!redirects[path]) {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "text/html"
      },
      body: pageNotFound,
      isBase64Encoded: true,
    };
  } else {
    const target = redirects[path];
    return {
      statusCode: 301,
      headers: {
        location: target,
      },
    };
  }
};
