"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniformServerConfigurationValidators = exports.validateUniformServerConfiguration = exports.parseUniformServerConfig = void 0;
var common_1 = require("@uniformdev/common");
function parseUniformServerConfig(env, logger, runtime) {
    if (runtime === void 0) { runtime = false; }
    var resolvedEnv = env || process.env;
    if (runtime) {
        logger.info("Loading Uniform config...");
    }
    var UNIFORM_PUBLISH_TEMP_DIR = common_1.getEnv(resolvedEnv, 'UNIFORM_PUBLISH_TEMP_DIR', '.temp');
    var UNIFORM_EXPORT_PREFETCH_ENABLED = common_1.getBoolEnv(resolvedEnv, 'UNIFORM_EXPORT_PREFETCH_ENABLED', true);
    var config = common_1.parseUniformConfig(resolvedEnv, runtime);
    var serverConfig = __assign(__assign({ UNIFORM_PUBLISH_TEMP_DIR: UNIFORM_PUBLISH_TEMP_DIR,
        UNIFORM_EXPORT_PREFETCH_ENABLED: UNIFORM_EXPORT_PREFETCH_ENABLED }, config), { env: __assign({}, resolvedEnv) });
    validateUniformServerConfiguration(serverConfig);
    return serverConfig;
}
exports.parseUniformServerConfig = parseUniformServerConfig;
function validateUniformServerConfiguration(config) {
    var isValid = Object.keys(exports.uniformServerConfigurationValidators).reduce(function (result, key) {
        var validationResult = exports.uniformServerConfigurationValidators[key](config);
        if (validationResult !== true) {
            result.push(validationResult);
        }
        return result;
    }, []);
    if (!isValid) {
        throw new Error("Uniform server configuration is invalid");
    }
}
exports.validateUniformServerConfiguration = validateUniformServerConfiguration;
exports.uniformServerConfigurationValidators = {};
//# sourceMappingURL=parseUniformServerConfig.js.map