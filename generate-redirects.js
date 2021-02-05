const fs = require("fs");
const qs = require("query-string");
const fetch = require("node-fetch");
const parser = require('xml2json');
const { cleanToUrl, cleanFromUrl } = require('./lib/helpers/redirect-url-parser.js');
require("dotenv").config();

const { UNIFORM_API_URL } = process.env;

function writeRedirectsJSON(data) {
  fs.writeFile("./functions_src/redirects.json", JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }
    console.log("Created ./functions_src/redirects.json");
  });
}

function processNode(node, formattedRedirects = []) {
  if (node.redirects) {
    node.redirects.forEach(item => {
      const fromUrl = cleanFromUrl(item.source);
      const toUrl = cleanToUrl(item.target);
      const alreadyExists = formattedRedirects.find(redirect => redirect.from === fromUrl)
      if (!alreadyExists) {
        formattedRedirects.push({
          from: fromUrl,
          to: toUrl
        }) 
      } else {
        console.log(`Skipping redirect as source already mapped: ${fromUrl} -> ${toUrl}`)
      }
    })
  }

  return formattedRedirects;
}

function parseManagedRedirectData(data) {
  return processNode(data);
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
  console.log("Parsing managed and legacy redirects, please wait...");

  const managedRedirects = await parseManagedRedirects();

  console.log(`Collected a total of ${Object.keys(managedRedirects).length} redirects`);

  writeRedirectsJSON(managedRedirects)
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

module.exports = { cleanFromUrl }