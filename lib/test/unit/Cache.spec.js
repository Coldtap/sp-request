"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Cache_1 = require("./../../src/core/utils/Cache");
describe('sp-request: Cache', () => {
    const cache = new Cache_1.Cache();
    it('should return item from cache without expiration', () => {
        const key = 'cache key';
        const value = { data: 'some data' };
        cache.set(key, value);
        const data = cache.get(key);
        (0, chai_1.expect)(data).to.equal(value);
    });
    it('should return null for non-existing item', () => {
        const data = cache.get('some key');
        (0, chai_1.expect)(data).to.be.undefined;
    });
    it('should clear the cache', () => {
        const key = 'key';
        cache.set(key, 'value');
        cache.clear();
        (0, chai_1.expect)(cache.get(key)).to.be.undefined;
    });
    it('should return item from cache with expiration in sec', () => {
        const key = 'cache key';
        const value = { data: 'some data' };
        cache.set(key, value, 1000);
        const data = cache.get(key);
        (0, chai_1.expect)(data).to.equal(value);
    });
    it('should return null when item expired', () => {
        const key = 'cache key';
        const value = { data: 'some data' };
        cache.set(key, value, -1);
        const data = cache.get(key);
        (0, chai_1.expect)(data).to.be.undefined;
    });
    it('should return item from cache with expiration on date', () => {
        const key = 'cache key';
        const value = { data: 'some data' };
        const now = new Date();
        now.setSeconds(now.getSeconds() + 10);
        cache.set(key, value, now);
        const data = cache.get(key);
        (0, chai_1.expect)(data).to.equal(value);
    });
    it('should return null when item expired on date', () => {
        const key = 'cache key';
        const value = { data: 'some data' };
        const now = new Date();
        now.setSeconds(now.getSeconds() - 1);
        cache.set(key, value, now);
        const data = cache.get(key);
        (0, chai_1.expect)(data).to.be.undefined;
    });
    it('should remove value from cache', () => {
        const key = 'cache key';
        const value = { data: 'some data' };
        cache.set(key, value);
        let data = cache.get(key);
        (0, chai_1.expect)(data).to.equal(value);
        cache.remove(key);
        data = cache.get(key);
        (0, chai_1.expect)(data).is.undefined;
    });
});
//# sourceMappingURL=Cache.spec.js.map