const fs = require("fs");

const notFoundPage = fs.readFileSync('./out/404/index.html');
const textBuffer = new Buffer(notFoundPage);

console.log(textBuffer.toString('base64'));

fs.writeFileSync('./functions_src/404.html.json', `{ \"pageNotFound\": \"${textBuffer.toString('base64')}\" }`);