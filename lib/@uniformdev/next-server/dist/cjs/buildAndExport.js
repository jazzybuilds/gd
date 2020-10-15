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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAndExport = void 0;
var fs_1 = require("fs");
var util_1 = __importDefault(require("util"));
var child_process_1 = __importDefault(require("child_process"));
var common_1 = require("@uniformdev/common");
var exec = util_1.default.promisify(child_process_1.default.exec);
function buildAndExport(outputDir, config, logger) {
    return __awaiter(this, void 0, void 0, function () {
        var clientRepoDir, defaultCommand, command, _a, stdout, stderr, message, threads, threadsSwitch, def, exportCommand, command1, apiUrl, sitename, _b, stdout, stderr, message;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    clientRepoDir = '.';
                    if (!!fs_1.existsSync('./.next/BUILD_ID')) return [3 /*break*/, 2];
                    logger.warn('The .next/BUILD_ID file does not exists which is either a bug or you have not executed next build');
                    logger.info('Running nextjs build process...');
                    defaultCommand = fs_1.existsSync('./node_modules/next/dist/bin/next')
                        ? 'node node_modules/next/dist/bin/next build'
                        : 'npx next build';
                    command = common_1.getEnv(config.env, 'UNIFORM_PUBLISH_NEXT_BUILD_COMMAND', defaultCommand);
                    logger.debug("Exec: " + command);
                    return [4 /*yield*/, exec(command, {
                            env: config.env,
                            cwd: clientRepoDir,
                            maxBuffer: 20 * 1024 * 1024,
                        })];
                case 1:
                    _a = _c.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    message = stdout.indexOf('Compiled successfully.') >= 0
                        ? 'success'
                        : 'fail, stdout: ' + stdout + ', stderr: ' + stderr;
                    if (message !== 'success') {
                        throw new Error("Next build has failed. Message: " + message);
                    }
                    _c.label = 2;
                case 2:
                    threads = common_1.getEnv(config.env, 'UNIFORM_PUBLISH_NEXT_EXPORT_THREADS', '');
                    threadsSwitch = threads ? " --threads " + threads : '';
                    def = (fs_1.existsSync('./node_modules/next/dist/bin/next')
                        ? 'node node_modules/next/dist/bin/next export --outdir "__DIR__"' + threadsSwitch
                        : 'npx next export --outdir "__DIR__"' + threadsSwitch);
                    exportCommand = common_1.getEnv(config.env, 'UNIFORM_PUBLISH_NEXT_EXPORT_COMMAND', '').trim();
                    if (!exportCommand) {
                        logger.info('UNIFORM_PUBLISH_NEXT_EXPORT_COMMAND is not defined, so switching to default: ' + def);
                        exportCommand = def;
                    }
                    if (!false) return [3 /*break*/, 3];
                    return [3 /*break*/, 5];
                case 3:
                    if (!exportCommand.includes('__DIR__')) {
                        throw new Error('The UNIFORM_PUBLISH_NEXT_EXPORT_COMMAND setting does not contain the __DIR__ token that will be replaced with dir to export to');
                    }
                    command1 = exportCommand.replace(/__DIR__/g, outputDir);
                    apiUrl = config.UNIFORM_DATA_URL.toLowerCase();
                    logger.debug("set UNIFORM_API_URL=" + apiUrl);
                    sitename = config.UNIFORM_API_SITENAME;
                    if (sitename.toLowerCase().endsWith('preview')) {
                        sitename = sitename.substring(0, sitename.length - 'preview'.length);
                    }
                    logger.info('Starting custom exec nextjs export process (with UNIFORM_API_SITENAME = ' + sitename + ')');
                    logger.debug("Exec: " + command1);
                    return [4 /*yield*/, exec(command1, {
                            env: __assign(__assign({}, config.env), { EXPORT_OUT_DIR: outputDir, UNIFORM_OPTIONS_DEBUG: '0', UNIFORM_API_URL: apiUrl, UNIFORM_API_SITENAME: sitename }),
                            cwd: clientRepoDir,
                            maxBuffer: 20 * 1024 * 1024,
                        })];
                case 4:
                    _b = _c.sent(), stdout = _b.stdout, stderr = _b.stderr;
                    message = stdout.indexOf('Export successful') >= 0
                        ? 'success'
                        : 'fail, stdout: ' + stdout + ', stderr: ' + stderr;
                    if (message !== 'success') {
                        throw new Error("Exporting has failed. Message: " + message + ", stdout: " + stdout + ", stderr: " + stderr);
                    }
                    _c.label = 5;
                case 5:
                    logger.info("Exporting has succeeded.");
                    return [2 /*return*/];
            }
        });
    });
}
exports.buildAndExport = buildAndExport;
//# sourceMappingURL=buildAndExport.js.map