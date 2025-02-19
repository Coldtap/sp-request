"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimSlashes = trimSlashes;
exports.removeTrailingSlash = removeTrailingSlash;
function trimSlashes(url) {
    return url.replace(/(^\/)|(^\\)|(\/$)|(\\$)/g, '');
}
function removeTrailingSlash(url) {
    return url.replace(/(\/$)|(\\$)/, '');
}
//# sourceMappingURL=utils.js.map