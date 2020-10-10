const uniformConfig = require('./uniform.config');
uniformConfig();

const { uniformNextConfig, UniformServerConfig } = require('@uniformdev/next-server');

module.exports = uniformNextConfig();
