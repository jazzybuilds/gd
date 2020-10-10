"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageProps = exports.getHtml = exports.getDatasources = exports.getDataItem = exports.getPageItem = void 0;
var common_1 = require("@uniformdev/common");
var common_2 = require("@uniformdev/common");
var getPageUrl_1 = require("./getPageUrl");
var convertDataItemToRuntimeItem_1 = require("./convertDataItemToRuntimeItem");
var noopLogger_1 = require("./noopLogger");
function getPageItem(path, logger, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDataItem(path, 'page', logger, config)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPageItem = getPageItem;
var readFileAsync = typeof window === 'undefined'
    ? eval("(require('util').promisify)(require('fs').readFile)")
    : undefined;
var existsAsync = typeof window === 'undefined'
    ? eval("(require('util').promisify)(require('fs').exists)")
    : undefined;
function getDataItem(path, type, logger, config) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, _a, _b, itemUrl, response, item;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(readFileAsync && existsAsync)) return [3 /*break*/, 3];
                    filename = 'public/uniform/api/content/' + config.UNIFORM_API_SITENAME + '/' + type + path;
                    if (filename.endsWith('/')) {
                        filename = filename.substring(0, filename.length - 1);
                    }
                    filename += '.json';
                    return [4 /*yield*/, existsAsync(filename)];
                case 1:
                    if (!_c.sent()) return [3 /*break*/, 3];
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readFileAsync(filename)];
                case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])];
                case 3:
                    itemUrl = getPageUrl_1.getPageUrl(path, type, config);
                    logger.debug('Making HTTP request (data): ' + itemUrl);
                    return [4 /*yield*/, common_1.fetchWithRetry(logger, itemUrl, 3)];
                case 4:
                    response = _c.sent();
                    if (response.status !== 200) {
                        throw new Error("No item, ajax request to " + response.url + " returned " + response.status + " code, text: " + response.statusText);
                    }
                    return [4 /*yield*/, response.json()];
                case 5:
                    item = _c.sent();
                    if (!item.id)
                        throw new Error('no item.id, ' + itemUrl + ', ' + JSON.stringify(item));
                    return [2 /*return*/, convertDataItemToRuntimeItem_1.convertDataItemToRuntimeItem(item, undefined, path)];
            }
        });
    });
}
exports.getDataItem = getDataItem;
function getDatasources(ids, logger, config) {
    return __awaiter(this, void 0, void 0, function () {
        var datasourcesData, func, datasources, id, datasource, guid;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    datasourcesData = {};
                    func = function (id) {
                        return __awaiter(this, void 0, void 0, function () {
                            var d, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (id === undefined || id === null) {
                                            throw new Error("id");
                                        }
                                        if (!(config.UNIFORM_OPTIONS_MVC_SUPPORT && config.UNIFORM_OPTIONS_MVC_MODE === 'mvconly')) return [3 /*break*/, 1];
                                        _a = {};
                                        return [3 /*break*/, 3];
                                    case 1: return [4 /*yield*/, getDataItem(id, 'item', logger, config)];
                                    case 2:
                                        _a = _b.sent();
                                        _b.label = 3;
                                    case 3:
                                        d = _a;
                                        datasourcesData[id] = d;
                                        return [2 /*return*/];
                                }
                            });
                        });
                    };
                    return [4 /*yield*/, Promise.all(ids.map(function (x) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, func(x)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 1:
                    _a.sent();
                    datasources = {};
                    for (id in datasourcesData) {
                        if (!datasourcesData.hasOwnProperty(id))
                            continue;
                        datasource = convertDataItemToRuntimeItem_1.convertDataItemToRuntimeItem(datasourcesData[id], undefined, undefined);
                        guid = common_2.parseGuid(id);
                        datasources[guid] = datasource;
                    }
                    return [2 /*return*/, datasources];
            }
        });
    });
}
exports.getDatasources = getDatasources;
function getHtml(path, logger, config) {
    return __awaiter(this, void 0, void 0, function () {
        var type, filename, _a, _b, htmlUrl, response;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    type = 'html';
                    if (!(readFileAsync && existsAsync)) return [3 /*break*/, 3];
                    filename = 'public/uniform/api/content/' + config.UNIFORM_API_SITENAME + '/' + type + path;
                    if (filename.endsWith('/')) {
                        filename = filename.substring(0, filename.length - 1);
                    }
                    filename += '.json';
                    return [4 /*yield*/, existsAsync(filename)];
                case 1:
                    if (!_c.sent()) return [3 /*break*/, 3];
                    logger.debug('Direct file system request (data): ' + filename);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readFileAsync(filename)];
                case 2: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])];
                case 3:
                    htmlUrl = getPageUrl_1.getPageUrl(path, 'html', config);
                    logger.debug('Making HTTP request (data): ' + htmlUrl);
                    return [4 /*yield*/, common_1.fetchWithRetry(logger, htmlUrl, 3)];
                case 4:
                    response = _c.sent();
                    if (response.status !== 200) {
                        throw new Error("No html, ajax request to " + response.url + " returned " + response.status + " code, text: " + response.statusText);
                    }
                    return [4 /*yield*/, response.json()];
                case 5: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.getHtml = getHtml;
function getPageProps(asPath, config, logger) {
    if (logger === void 0) { logger = noopLogger_1.noopLogger; }
    return __awaiter(this, void 0, void 0, function () {
        var path, item, home, datasources, html, _a, props;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger.info("Rendering page with path: " + asPath);
                    if (asPath && asPath.startsWith('/-'))
                        throw new Error('Must not be handled by page!');
                    path = asPath + (asPath.endsWith('/') ? '' : '/');
                    return [4 /*yield*/, getPageItem(path, logger, config)];
                case 1:
                    item = _b.sent();
                    home = item;
                    return [4 /*yield*/, getDatasources(item.datasources || common_2.throwException('item.datasources'), logger, config)];
                case 2:
                    datasources = _b.sent();
                    if (!config.UNIFORM_OPTIONS_MVC_SUPPORT) return [3 /*break*/, 4];
                    return [4 /*yield*/, getHtml(path, logger, config)];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = {};
                    _b.label = 5;
                case 5:
                    html = _a;
                    if (!item) {
                        throw new Error('No context item passed');
                    }
                    logger.debug("Resolved page '" + path + "'");
                    props = {
                        datasources: datasources,
                        html: html,
                        item: item,
                        page: item,
                        home: home,
                        path: path,
                    };
                    return [2 /*return*/, props];
            }
        });
    });
}
exports.getPageProps = getPageProps;
//# sourceMappingURL=getPageProps.js.map