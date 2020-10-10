const dotenv = require("dotenv");

// this file is not required, but it provides default standard values for the starter kit
// it is moved to the separate file because it is used in 2 places: server.ts and next.config.js
// you can override the values in the .env file if required

const defaults = {
  PORT: 3000,
  UNIFORM_IS_AT_RUNTIME: "1", // to enable properties validation during next build and next export
  UNIFORM_OPTIONS_MVC_SUPPORT: true,
  UNIFORM_OPTIONS_MVC_SPA_ENABLED: false,
  DEFAULT_SITE_LANGUAGE: "en",
};

function processDefault(key, fallback) {
  if (!key) {
    return null;
  }
  process.env[key] = process.env[key] || fallback;
}

module.exports = function () {
  dotenv.config();
  Object.keys(defaults).forEach((k) => processDefault(k, defaults[k]));
};
