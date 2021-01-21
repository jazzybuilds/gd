/* eslint-disable */
const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  plugins: [new webpack.EnvironmentPlugin(localEnv)],
}