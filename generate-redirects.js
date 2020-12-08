const fs = require("fs");
const parser = require('xml2json');

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function parseLegacyRedirects(path) {
  const data = fs.readFileSync(path);
  const json = JSON.parse(parser.toJson(data));
  const cleanRules = []
  json.rewrite.rules.rule.map(rule => {
    if (rule.action.redirectType !== '301') {
      throw new Error(`${rule.action.redirectType} not supported`)
    }
    const toUrlParse = rule.action.url.replace('https://{HTTP_HOST}', '').replace(/\/$/, '');
    const toUrl = toUrlParse ? toUrlParse : '/'
    if (rule.match.url.match(escapeRegex('(/)?$'))) {
      const fromUrl = `/${rule.match.url.replace('^', '').replace('(/)?$', '')}`
      if (!cleanRules[fromUrl]) {
        cleanRules[fromUrl] = toUrl
      }
    } else if (rule.match.url.match(escapeRegex('$'))) {
      const fromUrl = `/${rule.match.url.replace('^', '').replace('$', '')}`
      if (!cleanRules[fromUrl]) {
        cleanRules[fromUrl] = toUrl
      }
    } else {
      throw new Error(`Not Implemented`);
    }
  })
  const paths = Object.keys(cleanRules).map(fromUrl => {
    return `${fromUrl} ${cleanRules[fromUrl]} 301`
  })

  return `#Legacy Redirects\r\n${paths.join('\r\n')}`
}

console.log("Creating public/_redirects file");
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

  const legacyRedirects = parseLegacyRedirects('./RewriteRules.config');
  fs.writeFile("public/_redirects", `${text}\r\n${legacyRedirects}`, function (err) {
    if (err) {
      throw err;
    }
    console.log("Created public/_redirects file!");
  });
});

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

