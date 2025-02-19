"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const rewiremock_1 = require("rewiremock");
const spUrl = 'https://your_sp_api_endpoint';
const creds = {
    username: 'user',
    password: 'pass',
    domain: 'sp',
};
const defaultAcceptHeader = 'application/json;odata=verbose';
describe('sp-request: direct call tests - sprequest(...)', () => {
    let requestPromiseStub;
    let sprequest;
    beforeEach(() => {
        const requestDeferred = Promise.resolve({ statusCode: 200 });
        requestPromiseStub = sinon.stub().returns(requestDeferred);
        (0, rewiremock_1.default)('ky').with({ default: requestPromiseStub });
        (0, rewiremock_1.default)('node-sp-auth').with({
            getAuth: () => Promise.resolve({}),
        });
        rewiremock_1.default.enable();
        sprequest = require('./../../src/core/SPRequest');
    });
    afterEach(() => {
        rewiremock_1.default.disable();
    });
    it('should call got', (done) => {
        const request = sprequest.create(creds);
        request(spUrl)
            .then(() => {
            (0, chai_1.expect)(requestPromiseStub.called).is.true;
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with "GET" method when provided directly', (done) => {
        const request = sprequest.create(creds);
        request(spUrl, {
            method: 'GET',
        })
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with "POST" method when provided directly', (done) => {
        const request = sprequest.create(creds);
        request(spUrl, {
            method: 'POST',
        })
            .then(() => {
            (0, chai_1.expect)(requestPromiseStub.called).is.true;
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should set default accept header', (done) => {
        const request = sprequest.create(creds);
        request(spUrl)
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.headers['Accept']).to.equal(defaultAcceptHeader);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "GET" when called with string param', (done) => {
        const request = sprequest.create(creds);
        request(spUrl)
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "GET" when called with options object', (done) => {
        const request = sprequest.create(creds);
        request({
            url: spUrl,
        })
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "GET" when called with string as first param and object as second', (done) => {
        const request = sprequest.create(creds);
        request(spUrl, {})
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
});
describe('sp-request: helper call tests - sprequest.get(...)', () => {
    let requestPromiseStub;
    let sprequest;
    beforeEach(() => {
        const requestDeferred = Promise.resolve({ statusCode: 200 });
        requestPromiseStub = sinon.stub().returns(requestDeferred);
        (0, rewiremock_1.default)('ky').with({ default: requestPromiseStub });
        (0, rewiremock_1.default)('node-sp-auth').with({
            getAuth: () => Promise.resolve({}),
        });
        rewiremock_1.default.enable();
        sprequest = require('./../../src/core/SPRequest');
    });
    afterEach(() => {
        rewiremock_1.default.disable();
    });
    it('should call got with method "GET" when called with string param', (done) => {
        const request = sprequest.create(creds);
        request
            .get(spUrl)
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "GET" when called with options object', (done) => {
        const request = sprequest.create(creds);
        request
            .get({
            url: spUrl,
        })
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "GET" when called with string as first param and object as second', (done) => {
        const request = sprequest.create(creds);
        request
            .get(spUrl, {})
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('GET');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
});
describe('sp-request: helper call tests - sprequest.post(...)', () => {
    let requestPromiseStub;
    let sprequest;
    beforeEach(() => {
        const requestDeferred = Promise.resolve({ statusCode: 200 });
        requestPromiseStub = sinon.stub().returns(requestDeferred);
        (0, rewiremock_1.default)('ky').with({ default: requestPromiseStub });
        (0, rewiremock_1.default)('node-sp-auth').with({
            getAuth: () => Promise.resolve({}),
        });
        rewiremock_1.default.enable();
        sprequest = require('./../../src/core/SPRequest');
    });
    afterEach(() => {
        rewiremock_1.default.disable();
    });
    it('should call got with method "POST" when called with string param', (done) => {
        const request = sprequest.create(creds);
        request
            .post(spUrl)
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('POST');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "POST" when called with options object', (done) => {
        const request = sprequest.create(creds);
        request
            .post({
            url: spUrl,
        })
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('POST');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should call got with method "GET" when called with string as first param and object as second', (done) => {
        const request = sprequest.create(creds);
        request
            .post(spUrl, {})
            .then(() => {
            const call = requestPromiseStub.getCall(0);
            const options = call.args[0];
            (0, chai_1.expect)(options.method.toUpperCase()).to.equal('POST');
            (0, chai_1.expect)(options.url).to.equal(spUrl);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
});
describe('sp-request: throws an error', () => {
    let requestPromiseStub;
    let sprequest;
    const error = new Error('Uknown error occurred');
    beforeEach(() => {
        const requestDeferred = Promise.reject(error);
        requestPromiseStub = sinon.stub().returns(requestDeferred);
        (0, rewiremock_1.default)('ky').with({ default: requestPromiseStub });
        (0, rewiremock_1.default)('node-sp-auth').with({
            getAuth: () => Promise.resolve({}),
        });
        rewiremock_1.default.enable();
        sprequest = require('./../../src/core/SPRequest');
    });
    afterEach(() => {
        rewiremock_1.default.disable();
    });
    it('should throw an error', (done) => {
        const request = sprequest.create(creds);
        request
            .get(spUrl, {})
            .then(() => {
        }, (err) => {
            (0, chai_1.expect)(err).to.equal(error);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
});
describe('sp-request: get request digest', () => {
    let sprequest;
    beforeEach(() => {
        sprequest = require('./../../src/core/SPRequest');
    });
    it('should retrun request digest', (done) => {
        const request = sprequest.create(creds);
        const digest = 'digest value';
        const digestUrl = `${spUrl}/_api/contextinfo`;
        const response = {
            d: {
                GetContextWebInformation: {
                    FormDigestValue: digest,
                    FormDigestTimeoutSeconds: 0,
                },
            },
        };
        const requestDeferred = Promise.resolve({
            body: response,
        });
        const postStup = sinon.stub(request, 'post').returns(requestDeferred);
        request
            .requestDigest(spUrl)
            .then((digestValue) => {
            const call = postStup.getCall(0);
            const url = call.args[0];
            (0, chai_1.expect)(url).to.equal(digestUrl);
            (0, chai_1.expect)(postStup.called).is.true;
            (0, chai_1.expect)(digestValue).to.equal(digest);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
    it('should throw an error', (done) => {
        const request = sprequest.create(creds);
        const error = new Error('unexpected error');
        const requestDeferred = Promise.reject(error);
        sinon.stub(request, 'post').returns(requestDeferred);
        request
            .requestDigest(spUrl)
            .then(() => {
        })
            .catch((err) => {
            (0, chai_1.expect)(err).to.equal(error);
            done();
        });
    });
    it('should retrun request digest from cache on subsequence calls', (done) => {
        const request = sprequest.create(creds);
        const digest = 'digest value';
        const response = {
            d: {
                GetContextWebInformation: {
                    FormDigestValue: digest,
                    FormDigestTimeoutSeconds: 100,
                },
            },
        };
        const requestDeferred = Promise.resolve({
            body: response,
        });
        const postStup = sinon.stub(request, 'post').returns(requestDeferred);
        request
            .requestDigest(spUrl)
            .then(() => {
            postStup.restore();
            sinon.stub(request, 'post').throws();
            return request.requestDigest(spUrl);
        })
            .then((digestValue) => {
            (0, chai_1.expect)(digestValue).to.equal(digest);
            done();
        })
            .catch((err) => {
            done(err);
        });
    });
});
//# sourceMappingURL=SPRequest.spec.js.map