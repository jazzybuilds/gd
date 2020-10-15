// import libs
const dotenv = require("dotenv");
const { uniformNextConfig } = require("@uniformdev/next-server");

module.exports = function () {
  //   console.log("BEFORE:" + JSON.stringify(process.env));

  // load default configuration from uniform.config
  process.env.PORT = 3000;
  process.env.UNIFORM_API_SITENAME = "GuideDogsDotOrgPreview";
  process.env.UNIFORM_API_URL = "http://localhost";
  process.env.UNIFORM_API_TOKEN = "12345";
  process.env.UNIFORM_MODE = "preview";
  
  // complete configuration using dotenv
  const env = dotenv.config();

  const keys = Object.keys(env.parsed);
  keys.forEach((k) => {
    const value = env.parsed[k];
    console.log("Setting " + k + "env variable to " + value);
    process.env[k] = env.parsed[k];
  });

  // these values must not be changed via .env
  process.env.UNIFORM_OPTIONS_MVC_SUPPORT = "true";
  process.env.UNIFORM_OPTIONS_MVC_SPA_ENABLED = "false";
  //process.env.UNIFORM_OPTIONS_MVC_MODE = "mixed";
  process.env.UNIFORM_PUBLISH_TARGET = "none";

  //console.log("AFTER:" + JSON.stringify(process.env));

  return uniformNextConfig();
};
