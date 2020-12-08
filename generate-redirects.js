const fs = require("fs");
const parser = require('xml2json');
const dotenv = require("dotenv");
const env = dotenv.config();

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

fs.readFile('_redirects.template', 'utf8', function (err, data) {
  if (err) {
    throw err;
  }
  let text = data.toString();

  const envKeys = Object.keys(env.parsed);
  envKeys.forEach((k) => {
    const value = env.parsed[k];
    console.log("Using " + k + " env variable as: " + value);
    text = text.replace(`{${k}}`, value);
  });

  const legacyRedirects = parseLegacyRedirects('./RewriteRules.config');
  fs.writeFile("public/_redirects", `${text}\r\n${legacyRedirects}`, function (err) {
    if (err) {
      throw err;
    }
    console.log("Saved!");
  });
});



