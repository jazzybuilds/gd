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
    const toUrl = cleanToUrl(rule.action.url);
    if (!cleanRules[fromUrl]) {
      cleanRules[fromUrl] = toUrl;
    }
  })
  const paths = Object.keys(cleanRules).map(fromUrl => {
    return `${fromUrl} ${cleanRules[fromUrl]} 301`;
  })

  return `# Legacy Redirects\r\n${paths.join('\r\n').toLowerCase()}`
}

function parseManagedRedirectData(data) {
  const paths = data.redirects.map(item => {
    const fromUrl = cleanFromUrl(item.source);
    const toUrl = cleanToUrl(item.target);
    return `${fromUrl} ${toUrl} 301`;
  })
  return `# Managed Redirects\r\n${paths.join('\r\n').toLowerCase()}`;
}

async function parseManagedRedirects() {
  return fetch(`${UNIFORM_API_URL}/uniform/api/content/guidedogsdotorg/map.json`)
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
  console.log("Creating _redirects file");

  const managedRedirects = await parseManagedRedirects();
  const legacyRedirects = parseLegacyRedirects('./RewriteRules.config');
  fs.readFile('./_redirects.template', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }

    let text = data.toString();

    // Update redirects template with origin hosts.
    console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
    text = text.replace(/{SITECORE_ORIGIN}/g, process.env.SITECORE_ORIGIN);

    console.log("Using MEDIA_ORIGIN as: " + process.env.MEDIA_ORIGIN);
    text = text.replace(/{MEDIA_ORIGIN}/g, process.env.MEDIA_ORIGIN);

    fs.writeFile("./public/_redirects", `${text}\r\n${managedRedirects}\r\n\r\n${legacyRedirects}`, function (err) {
      if (err) {
        throw err;
      }
      console.log("Created _redirects file!");
    });
  });
}

async function updateNetlifyToml() {
  console.log("Updating netlify.toml");

  fs.readFile('./netlify.toml.template', 'utf8', function (err, data) {

    let text = data.toString();

    // Update redirects in netlify.toml with origin hosts.
    console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
    text = text.replace(/{SITECORE_ORIGIN}/g, process.env.SITECORE_ORIGIN);

    console.log("Using MEDIA_ORIGIN as: " + process.env.MEDIA_ORIGIN);
    text = text.replace(/{MEDIA_ORIGIN}/g, process.env.MEDIA_ORIGIN);

    console.log("Using SITECORE_PROXY_BASIC_AUTH as: " + process.env.SITECORE_PROXY_BASIC_AUTH);
    text = text.replace(/{SITECORE_PROXY_BASIC_AUTH}/g, process.env.SITECORE_PROXY_BASIC_AUTH);

    fs.writeFile('./netlify.toml', `${text}`, function (err) {
      if (err) {
        throw err;
      }

      console.log("Updated netlify.toml!");
    });
  });
}

parseRedirects();
updateNetlifyToml();