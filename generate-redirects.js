const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

fs.readFile('_redirects.template', 'utf8', function(err, data) {
  if (err) throw err;

  const text = data.toString();
  console.log(text);
  fs.writeFile("public/_redirects", text, function (err) {
    if (err) throw err;

    console.log("Saved!");
  });  
});
