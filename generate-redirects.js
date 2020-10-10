const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const language = process.env.DEFAULT_SITE_LANGUAGE;

if (!language) {
  throw new Error("The DEFAULT_SITE_LANGUAGE environment variable is not defined");
}

fs.readFile('_redirects.template', 'utf8', function(err, data) {
  if (err) throw err;

  const text = data.toString().replace(/\$\{language\}/g, language);
  console.log(text);
  fs.writeFile("public/_redirects", text, function (err) {
    if (err) throw err;

    console.log("Saved!");
  });  
});
