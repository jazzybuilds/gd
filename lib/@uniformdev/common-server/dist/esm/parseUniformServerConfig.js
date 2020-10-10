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
import { getEnv, parseUniformConfig, getBoolEnv, } from '@uniformdev/common';
export function parseUniformServerConfig(env, logger, runtime) {
    if (runtime === void 0) { runtime = false; }
    var resolvedEnv = env || process.env;
    if (runtime) {
        logger.info("Loading Uniform config...");
    }
    var UNIFORM_PUBLISH_TEMP_DIR = getEnv(resolvedEnv, 'UNIFORM_PUBLISH_TEMP_DIR', '.temp');
    var UNIFORM_EXPORT_PREFETCH_ENABLED = getBoolEnv(resolvedEnv, 'UNIFORM_EXPORT_PREFETCH_ENABLED', true);
    var config = parseUniformConfig(resolvedEnv, runtime);
    var serverConfig = __assign(__assign({ UNIFORM_PUBLISH_TEMP_DIR: UNIFORM_PUBLISH_TEMP_DIR,
        UNIFORM_EXPORT_PREFETCH_ENABLED: UNIFORM_EXPORT_PREFETCH_ENABLED }, config), { env: __assign({}, resolvedEnv) });
    validateUniformServerConfiguration(serverConfig);
    return serverConfig;
}
export function validateUniformServerConfiguration(config) {
    var isValid = Object.keys(uniformServerConfigurationValidators).reduce(function (result, key) {
        var validationResult = uniformServerConfigurationValidators[key](config);
        if (validationResult !== true) {
            result.push(validationResult);
        }
        return result;
    }, []);
    if (!isValid) {
        throw new Error("Uniform server configuration is invalid");
    }
}
export var uniformServerConfigurationValidators = {};
//# sourceMappingURL=parseUniformServerConfig.js.map