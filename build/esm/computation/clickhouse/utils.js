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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHUtils = exports.setCHConfig = exports.getCHConfig = exports.CLICKHOUSE_CONFIG = void 0;
var axios_1 = __importDefault(require("axios"));
exports.CLICKHOUSE_CONFIG = {
    protocol: 'http',
    host: 'localhost',
    port: 8123,
    path: ''
};
function getCHConfig() {
    return exports.CLICKHOUSE_CONFIG;
}
exports.getCHConfig = getCHConfig;
function setCHConfig(config) {
    Object.keys(config).forEach(function (k) {
        exports.CLICKHOUSE_CONFIG[k] = config[k];
    });
}
exports.setCHConfig = setCHConfig;
var CHUtils = /** @class */ (function () {
    function CHUtils(config) {
        this.config = config || {
            protocol: 'http',
            host: 'localhost',
            port: 8123,
            path: ''
        };
    }
    CHUtils.prototype.getCHConfig = function () {
        return this.config;
    };
    CHUtils.prototype.setCHConfig = function (config) {
        var _this = this;
        Object.keys(config).forEach(function (k) {
            _this.config[k] = config[k];
        });
    };
    CHUtils.prototype.query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var config, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = this.config;
                        return [4 /*yield*/, (0, axios_1.default)("".concat(config.protocol, "://").concat(config.host, ":").concat(config.port).concat(config.path, "?query=").concat(sql))];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("[SQL Error] ".concat(sql, ".\n").concat(error_1.toString()));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CHUtils.prototype.queryw = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var config, res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = this.config;
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(config.protocol, "://").concat(config.host, ":").concat(config.port).concat(config.path),
                                method: 'post',
                                params: {
                                    query: sql
                                }
                            })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.data];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("[SQL Error] ".concat(sql, ".\n").concat(error_2.toString()));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CHUtils;
}());
exports.CHUtils = CHUtils;
