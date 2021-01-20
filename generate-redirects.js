const fs = require("fs");
const qs = require("query-string");
const fetch = require("node-fetch");
const parser = require('xml2json');
require("dotenv").config();

const { UNIFORM_API_URL } = process.env;

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function addTrailingSlash(url) {
  if (url === '/' || url.indexOf('&') > -1 || url.indexOf('?') > -1) {
    return url;
  }
  return url.endsWith('/') ? url : `${url}/`;
}

function cleanFromUrl(url) {
  url = url.trim().replace(/^\^/ig, '').replace(/^\//ig, '').replace(/\\\./ig, '.').replace(/\/$/ig, '');
  if (url.match(escapeRegex('(/)?$'))) {
    return `/${url.replace('(/)?$', '')}`.trim().replace(/ /gi, '%20');
  } else if (url.match(escapeRegex('$'))) {
    return `/${url.replace('$', '')}`.trim().replace(/ /gi, '%20');
  }
  return `/${url.trim().replace(/ /gi, '%20')}`;
}

function cleanToUrl(url) {
  const toUrlParse = url.trim().replace('https://{HTTP_HOST}', '').replace('www.guidedogs.org.uk/', '/').trim().replace(/\/$/gi, '').replace(/^\//gi, '');
  const toUrl = (toUrlParse ? toUrlParse : '/').replace(/ /gi, '%20');
  return addTrailingSlash(toUrl.startsWith('http') || toUrl === '/' ? toUrl : `/${toUrl}`);
}

function parseLegacyRedirects(path) {
  const data = fs.readFileSync(path);
  const json = JSON.parse(parser.toJson(data));
  const cleanRules = [];
  json.rewrite.rules.rule.map(rule => {
    if (rule.action.redirectType !== '301') {
      throw new Error(`${rule.action.redirectType} not supported`)
    }
    const fromUrl = cleanFromUrl(rule.match.url);
    const toUrl = cleanToUrl(rule.action.url).toLowerCase();
    const normalisedFromUrl = fromUrl.toLowerCase();
    if (!cleanRules[normalisedFromUrl]) {
      cleanRules[normalisedFromUrl] = toUrl;
      if (normalisedFromUrl !== fromUrl) {
        cleanRules[`_L_${fromUrl}`] = toUrl;
      }
    }
  })
  const paths = Object.keys(cleanRules).map(fromUrl => {
    return `${fromUrl.replace('_L_', '')} ${cleanRules[fromUrl]} 301`;
  })

  console.log(`Added ${paths.length} legacy redirect(s)`);

  return `# Legacy Redirects\r\n${paths.join('\r\n')}`
}

function processNode(node) {
  let combinedRedirects = [];
  for (let [, value] of Object.entries(node.children)) {
    combinedRedirects = combinedRedirects.concat(processNode(value));
  }
  if (node.redirects) {
    var redirects = node.redirects.map(item => {
      const fromUrl = cleanFromUrl(item.source);
      const toUrl = cleanToUrl(item.target).toLowerCase();
      const normalisedFromUrl = fromUrl.toLowerCase();
      if (normalisedFromUrl !== fromUrl) {
        console.log(fromUrl);
        return [`${normalisedFromUrl} ${toUrl} 301`, `${fromUrl} ${toUrl} 301`];
      }
      return `${normalisedFromUrl} ${toUrl} 301`;
    });
    redirects = redirects.flat(2)
    console.log(`Added ${redirects.length} managed redirect(s) from Sitecore path: ${node.path}`);

    return combinedRedirects.concat(redirects);
  }

  return combinedRedirects;

}
function parseManagedRedirectData(data) {
  const paths = processNode(data);

  return `# Managed Redirects\r\n${paths.join('\r\n')}`;
}

async function parseManagedRedirects() {
  let mapUrl = `${UNIFORM_API_URL}/uniform/api/content/guidedogsdotorg/map.json`;

  console.log(`Fetching map.json for redirects from: ${mapUrl}`)

  return fetch(mapUrl)
    .then(res => res.json())
    .then(data => parseManagedRedirectData(data))
    .then(data => {
      return data;
    })
    .catch(error => {
      // Could use environment variable here to define behaviour, e.g. throw error.
      console.log("Error retrieving managed redirects.");
      console.log(error);

      return "";
    })
}

async function parseRedirects() {
  console.log("Creating _redirects file from _redirects.template");

  const managedRedirects = await parseManagedRedirects();
  const legacyRedirects = parseLegacyRedirects('./RewriteRules.config');
  fs.readFile('./_redirects.template', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    let text = data.toString();

    // Update redirects template with origin hosts.
    text = text.replace(/{SITECORE_ORIGIN}/g, process.env.SITECORE_ORIGIN);
    text = text.replace(/{MEDIA_ORIGIN}/g, process.env.MEDIA_ORIGIN);

    fs.writeFile("./public/_redirects", `${text}\r\n${managedRedirects}\r\n\r\n${legacyRedirects}`, function (err) {
      if (err) {
        throw err;
      }
      console.log("Created ./public/_redirects");
    });
  });
}

const sitecoreProxyRedirectTemplate = `[[redirects]]
  from = '{SITECORE_PATH}'
  to = '{SITECORE_ORIGIN}{SITECORE_PATH}'
  status = 200
  force = true
  [redirects.headers]
      Authorization = "Basic {SITECORE_PROXY_BASIC_AUTH}"		
`;

async function parseManagedExclusions() {
  let mapUrl = `${UNIFORM_API_URL}/uniform/api/content/guidedogsdotorg/map.json`;

  console.log(`Fetching map.json for exclusions from: ${mapUrl}`)

  return fetch(mapUrl)
    .then(res => res.json())
    .then(data => {
      return data.excluded.map(path => {
        console.log("Creating proxy to Sitecore for " + path);
        return sitecoreProxyRedirectTemplate.replace(/{SITECORE_PATH}/g, path)
      }).join("\r\n");
    })
    .catch(error => {
      // Could use environment variable here to define behaviour, e.g. throw error.
      console.log("Error retrieving managed exclusions.");
      console.log(error);

      return "";
    })
}

async function parseSecurityHeaders() {
  let pageUrl = `${UNIFORM_API_URL}/uniform/api/content/guidedogsdotorg/page.json`;

  console.log(`Fetching page.json for security headers from: ${pageUrl}`)

  return fetch(pageUrl)
    .then(res => res.json())
    .then(data => {
      if (data.fields.securityheaders && data.fields.securityheaders["Content-Security-Policy"]) {
        return `Content-Security-Policy = "${data.fields.securityheaders["Content-Security-Policy"]}"`
      }
      return "";
    })
    .catch(error => {
      // Could use environment variable here to define behaviour, e.g. throw error.
      console.log("Error retrieving security headers.");
      console.log(error);

      return "";
    })
}

async function parseNetlifyToml() {
  console.log("Creating netlify.toml from netlify.toml.template");

  const proxyRedirects = await parseManagedExclusions();
  const headers = await parseSecurityHeaders();

  fs.readFile('./netlify.toml.template', 'utf8', function (err, data) {

    let text = data.toString();

    // Update redirects in netlify.toml.template with origin hosts.
    text = text.replace(/{PROXIES_TO_SITECORE}/g, proxyRedirects);

    text = text.replace(/{PARSED_HEADERS}/g, headers);

    text = text.replace(/{NETLIFY_URL}/g, process.env.URL);
    text = text.replace(/{SITECORE_ORIGIN}/g, process.env.SITECORE_ORIGIN);
    text = text.replace(/{MEDIA_ORIGIN}/g, process.env.MEDIA_ORIGIN);
    text = text.replace(/{SITECORE_PROXY_BASIC_AUTH}/g, process.env.SITECORE_PROXY_BASIC_AUTH);

    fs.writeFile('./netlify.toml', `${text}`, function (err) {
      if (err) {
        throw err;
      }

      console.log("Created ./netlify.toml");
    });
  });
}

console.log("Using URL as: " + process.env.URL);
console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
console.log("Using MEDIA_ORIGIN as: " + process.env.MEDIA_ORIGIN);

parseRedirects();
parseNetlifyToml();