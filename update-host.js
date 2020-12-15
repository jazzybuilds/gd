const fs = require("fs");
require("dotenv").config();

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

async function updateFileWithHost(filePath)
{
  console.log(`Updating ${filePath} to patch host`);

  fs.readFile(filePath, 'utf8', function (err, data) {

    let text = data.toString();

    console.log("Replacing SITECORE_ORIGIN with URL variable");
    console.log("Using SITECORE_ORIGIN as: " + process.env.SITECORE_ORIGIN);
    console.log("Using URL as: " + process.env.URL);

    const regex = new RegExp(escapeRegExp(process.env.SITECORE_ORIGIN),"gi");
    text = text.replace(regex, process.env.URL);  

    fs.writeFile(filePath, `${text}`, function (err) {
      if (err) {
        throw err;
      }
      
      console.log(`Updated ${filePath}`);
    });
  });
}

if (process.argv) {
  const args = process.argv.slice(2);
  if (args && Array.isArray(args) && args.length > 0) {
    const filePath = args[0];

    updateFileWithHost(filePath);
  }
  else {
    console.warn("Bad args");
  }
}