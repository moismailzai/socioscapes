var assert = require('assert');
var socioscapes = require('../../src/main.js');
describe('socioscapes', function() {
    describe('#socioscapes', function () {
        it('should be a function', function () {
            assert.equal(true, typeof socioscapes === 'function');
        });
        it('should return an object', function () {
            assert.equal(true, typeof socioscapes() === 'object');
        });
        it('should create "scape0" when run without an argument', function () {
            delete 'scape0';
            socioscapes();
            assert.equal(true, !!scape0);
        });
        it('should load "myArbitraryScape" when given argument "myArbitraryScape"', function () {
            socioscapes().new('myArbitraryScape');
            assert.equal(true, socioscapes('myArbitraryScape').meta.name === 'myArbitraryScape');
            delete myArbitraryScape;
        });
        it('should return an object with OBJECT member .meta', function () {
            assert.equal(true, !!socioscapes().meta);
            assert.equal(true, typeof socioscapes().meta === 'object');
        });
        it('should return an object with FUNCTION member .new', function () {
            assert.equal(true, !!socioscapes().new);
            assert.equal(true, typeof socioscapes().new === 'function');
        });
        it('should return an object with OBJECT member .schema', function () {
            assert.equal(true, !!socioscapes().schema);
            assert.equal(true, typeof socioscapes().schema === 'object');
        });
        it('should return an object with FUNCTION member .state', function () {
            assert.equal(true, !!socioscapes().state);
            assert.equal(true, typeof socioscapes().state === 'function');
        });
        it('should return an object with OBJECT member .this', function () {
            assert.equal(true, !!socioscapes().this);
            assert.equal(true, typeof socioscapes().this === 'object');
        });
    });
    describe('#socioscapes().meta', function () {
        it('should be an object', function () {
            assert.equal(true, typeof socioscapes().meta === 'object');
        });
        it('should have a .type member with value "scape.sociJson"', function () {
            assert.equal('scape.sociJson', socioscapes().meta.type);
        });
    });
    describe('#socioscapes().new', function () {
        it('should be a function', function () {
            assert.equal(true, typeof socioscapes().new === 'function');
        });
        it('should create global object "myArbitraryScape" when given argument "myArbitraryScape"', function () {
            socioscapes().new('myArbitraryScape');
            assert.equal(true, !!myArbitraryScape);
            delete myArbitraryScape;
        });
        it('should create objects that have a meta.type member with value "scape.sociJson"', function () {
            socioscapes().new('myArbitraryScape');
            assert.equal('scape.sociJson', myArbitraryScape.meta.type);
            delete myArbitraryScape;
        });
    });
    describe('#socioscapes().schema', function () {
        it('should be an object', function () {
            assert.equal(true, typeof socioscapes().schema === 'object');
        });
    });
    describe('#socioscapes().state', function () {
        it('should be a function', function () {
            assert.equal(true, typeof socioscapes().state === 'function');
        });
    });
    describe('#socioscapes().this', function () {
        it('should be an object', function () {
            assert.equal(true, typeof socioscapes().this === 'object');
        });
    });
});