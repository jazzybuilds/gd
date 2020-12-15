const fs = require("fs");
require("dotenv").config();

let robotsFilePath = 'public/robots.txt';

console.log(`Updating ${robotsFilePath} to patch host`);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

fs.readFile(robotsFilePath, 'utf8', function (err, data) {

  let text = data.toString();

  // Update redirects in netlify.toml with origin hosts.
  console.log("Replacing SITECORE_ORIGIN with URL variable");
  console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
  console.log("Using URL as: " + process.env.URL);

  const regex = new RegExp(escapeRegExp(process.env.SITECORE_ORIGIN),"gi");
  text = text.replace(regex, process.env.URL);  

  fs.writeFile(robotsFilePath, `${text}`, function (err) {
    if (err) {
      throw err;
    }
    
    console.log(`Updated ${robotsFilePath}`);
  });
  });