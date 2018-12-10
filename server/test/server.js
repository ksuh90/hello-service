require('dotenv').config();
const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const jwt = require('jsonwebtoken');
const server = require('../server.js');

describe('service', function() {

    describe('hello', function() {

        describe('sayHello', function() {
            const sayHello = server.sayHello;
            const getStub = sinon.stub().withArgs('Authorization');
            const call = { metadata: { get: getStub }};

            it('should return with hello message for valid jwt', function() {
                const callback = function(err, resp) {
                    assert.equal(resp.message, 'Hello hulk');
                };

                // Create valid jwt
                const token = jwt.sign(
                    { username: 'hulk' },
                    process.env.SECRET,
                    { expiresIn: '2m' }
                );

                getStub.returns([`Bearer ${token}`]);
                sayHello(call, callback);
            });

            it('should return error for missing jwt', function() {
                const callback = function(err, resp) {
                    assert.equal(err.code, 16);
                };

                getStub.returns([`Bearer `]);
                sayHello(call, callback);
            });

            it('should return error for invalid jwt', function() {
                const callback = function(err, resp) {
                    assert.equal(err.code, 16);
                };

                getStub.returns([`Bearer blahblahblah`]);
                sayHello(call, callback);
            });

            it('should return error for expired jwt', function() {
                const callback = function(err, resp) {
                    assert.equal(err.code, 16);
                    assert.include(err.details, 'expired');
                };

                // Create expired jwt
                const token = jwt.sign(
                    {
                        exp: 0,
                        data: { username: 'hulk' }
                    },
                    process.env.SECRET
                );

                getStub.returns([`Bearer ${token}`]);
                sayHello(call, callback);
            });

            it('should return error for expired jwt', function() {
                const callback = function(err, resp) {
                    assert.equal(err.code, 16);
                    assert.equal(err.details, 'invalid signature');
                };

                // Create expired jwt
                const token = jwt.sign(
                    { username: 'hulk' },
                    'wrong secret',
                    { expiresIn: '2m' }
                );

                getStub.returns([`Bearer ${token}`]);
                sayHello(call, callback);
            });
        });
    });
});
