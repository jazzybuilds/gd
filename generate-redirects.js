const fs = require("fs");
const qs = require("query-string");
const fetch = require("node-fetch");
const parser = require('xml2json');

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const { UNIFORM_API_URL } = process.env
console.log(UNIFORM_API_URL)
function cleanFromUrl(url) {
  url = url.trim().replace(/^\^/ig, '').replace(/^\//ig, '').replace(/\\\./ig, '.').replace(/\/$/ig, '')
  if (url.match(escapeRegex('(/)?$'))) {
    return `/${url.replace('(/)?$', '')}`.trim().replace(/ /gi, '%20');
  } else if (url.match(escapeRegex('$'))) {
    return `/${url.replace('$', '')}`.trim().replace(/ /gi, '%20');
  }
  return `/${url.trim().replace(/ /gi, '%20')}`;
}

function cleanToUrl(url) {
  const toUrlParse = url.trim().replace('https://{HTTP_HOST}', '').replace('www.guidedogs.org.uk/', '/').trim().replace(/\/$/gi, '').replace(/^\//gi, '');;
  const toUrl = (toUrlParse ? toUrlParse : '/').replace(/ /gi, '%20')
  return toUrl.startsWith('http') ? toUrl : `/${toUrl}`
}

function parseLegacyRedirects(path) {
  const data = fs.readFileSync(path);
  const json = JSON.parse(parser.toJson(data));
  const cleanRules = []
  json.rewrite.rules.rule.map(rule => {
    if (rule.action.redirectType !== '301') {
      throw new Error(`${rule.action.redirectType} not supported`)
    }
    const fromUrl = cleanFromUrl(rule.match.url);
    const toUrl = cleanToUrl(rule.action.url);
    if (!cleanRules[fromUrl]) {
      cleanRules[fromUrl] = toUrl
    }
  })
  const paths = Object.keys(cleanRules).map(fromUrl => {
    return `${fromUrl} ${cleanRules[fromUrl]} 301`
  })

  return `# Legacy Redirects\r\n${paths.join('\r\n')}`
}

function recurseRedirectData(data, paths) {
  Object.keys(data).map(key => {
    const item = data[key]
    if (item.fields && item.fields.urlmapping) {
      const rules = qs.parse(item.fields.urlmapping);
      Object.keys(rules).map(rule => {
        if (rule) {
          const fromUrl = cleanFromUrl(rule);
          const toUrl = cleanToUrl(rules[rule]);
          paths.push(`${fromUrl} ${toUrl} 301`);
        }
      })
    }
    if (item.children) {
      recurseRedirectData(item.children, paths)
    }
  })
}

function parseManagedRedirectData(data) {
  const paths = [];
  recurseRedirectData(data.children, paths)
  return `# Managed Redirects\r\n${paths.join('\r\n')}`
}

async function parseManagedRedirects() {
  return fetch(`${UNIFORM_API_URL}/uniform/api/content/guidedogsdotorg/item/449fd60e-eea7-45c8-86c7-508ecb799e1d.json`)
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
  console.log("Creating public/_redirects file");
  
  const managedRedirects = await parseManagedRedirects();
  const legacyRedirects = parseLegacyRedirects('./RewriteRules.config');
  fs.readFile('_redirects.template', 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    
    let text = data.toString();
    
    // Update redirects template with origin hosts.
    console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
    text = text.replace(/{SITECORE_ORIGIN}/g, process.env.SITECORE_ORIGIN);

    console.log("Using MEDIA_ORIGIN as: " + process.env.MEDIA_ORIGIN);
    text = text.replace(/{MEDIA_ORIGIN}/g, process.env.MEDIA_ORIGIN);
    
    fs.writeFile("public/_redirects", `${text}\r\n${managedRedirects}\r\n\r\n${legacyRedirects}`, function (err) {
      if (err) {
        throw err;
      }
      console.log("Created public/_redirects file!");
    });
  });
}

async function updateNetlifyToml() {
  console.log("Updating netlify.toml");

  fs.readFile('netlify.toml', 'utf8', function (err, data) {

    let text = data.toString();

    // Update redirects in netlify.toml with origin hosts.
    console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
    text = text.replace(/{SITECORE_ORIGIN}/g, process.env.SITECORE_ORIGIN);

    console.log("Using MEDIA_ORIGIN as: " + process.env.MEDIA_ORIGIN);
    text = text.replace(/{MEDIA_ORIGIN}/g, process.env.MEDIA_ORIGIN);  

    console.log("Using SITECORE_PROXY_BASIC_AUTH as: " + process.env.SITECORE_PROXY_BASIC_AUTH);
    text = text.replace(/{SITECORE_PROXY_BASIC_AUTH}/g, process.env.SITECORE_PROXY_BASIC_AUTH);  

    fs.writeFile('netlify.toml', `${text}`, function (err) {
      if (err) {
        throw err;
      }
      
      console.log("Updated netlify.toml!");
    });
  });
}

parseRedirects();
updateNetlifyToml();