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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDigestCache = void 0;
exports.create = create;
const util = require("util");
const spauth = require("node-sp-auth");
const crypto = require("crypto");
const ky_1 = require("ky");
const Cache_1 = require("./utils/Cache");
exports.requestDigestCache = new Cache_1.Cache();
function create(credentials) {
    const coreRequest = (_a) => __awaiter(this, void 0, void 0, function* () {
        var { url } = _a, options = __rest(_a, ["url"]);
        options.throwHttpErrors = true;
        options.headers = options.headers || {};
        options.headers = Object.assign({
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
        }, options.headers);
        const additionalHeadersStr = process.env['_sp_request_headers'];
        if (additionalHeadersStr) {
            Object.assign(options.headers, JSON.parse(additionalHeadersStr));
        }
        options = Object.assign({
            responseType: 'json',
            resolveBodyOnly: false,
        }, options);
        const data = yield spauth.getAuth(url, credentials);
        Object.assign(options.headers, data.headers);
        Object.assign(options, data.options);
        return yield (0, ky_1.default)(url, options);
    });
    const spRequestFunc = ((url, options) => {
        if (typeof url === 'string') {
            options = Object.assign({ url }, options);
        }
        else {
            options = Object.assign(Object.assign({}, url), options);
        }
        if (!options.method) {
            options.method = 'get';
        }
        return coreRequest(options);
    });
    spRequestFunc.requestDigest = (siteUrl) => __awaiter(this, void 0, void 0, function* () {
        const url = siteUrl.replace(/\/$/, '');
        const cacheKey = crypto
            .createHash('md5')
            .update(util.format('%s@%s', url, JSON.stringify(credentials)))
            .digest('hex');
        const cachedDigest = exports.requestDigestCache.get(cacheKey);
        if (cachedDigest) {
            return cachedDigest;
        }
        const response = yield spRequestFunc.post(`${url}/_api/contextinfo`, { responseType: 'json' });
        const data = yield response.json();
        const digest = data.d.GetContextWebInformation.FormDigestValue;
        const timeout = parseInt(data.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
        exports.requestDigestCache.set(cacheKey, digest, timeout - 30);
        return digest;
    });
    ['get', 'post', 'put', 'patch', 'head', 'delete'].forEach((method) => {
        spRequestFunc[method] = (url, options) => spRequestFunc(url, Object.assign(Object.assign({}, options), { method }));
    });
    return spRequestFunc;
}
//# sourceMappingURL=SPRequest.js.map