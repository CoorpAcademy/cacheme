'use strict';
var expect      = require('chai').expect;
var httpCacheMiddleware = require('../lib/httpCache');
var HTTPCache   = httpCacheMiddleware.HTTPCache;

var settedHeader = {};
var res = {
    header: function(key, value) {
        if (value === undefined) {
            return settedHeader[key];
        }
        settedHeader[key] = value;
    },
    setHeader: function(key, value) {
        settedHeader[key] = value;
    },
    removeHeader: function(key) {
        delete settedHeader[key];
    },
    resetHeader: function() {
        settedHeader = {};
    },
    end: function() {
        // fake method to allow testing
    }
};

/******

{
    override: 'public, smax-age: 40',
    proxy: 'public',
    unit: 'second, minute, hour, month, year',
    duration: 60
        }

******/

describe('httpCache', function() {
    var hc;

    beforeEach(function() {
        res.resetHeader();
    });

    it('should be overrided at constructor level', function() {
        hc = new HTTPCache({
            override: 'override',
            proxy: 'public',
            unit: 'second',
            duration: 60
        });
        expect(hc.getHeader()).to.equal('override');
    });

    it('should be overrided at method header', function() {
        hc = new HTTPCache({
            override: 'override',
            proxy: 'public',
            unit: 'second',
            duration: 60
        });

        var specificOverride = hc.getHeader({
            override: 'override2'
        });
        expect(specificOverride).to.equal('override2');
    });

    it('should set cache control public at constructor level', function() {
        hc = new HTTPCache({
            proxy: 'public',
            unit: 'second',
            duration: 60
        });
        expect(hc.getHeader()).to.equal('public, max-age=60');
    });

    it('should set cache control public at method level', function() {
        hc = new HTTPCache({
            proxy: 'public',
            unit: 'second',
            duration: 60
        });

        var specificDuration = hc.getHeader({
            duration: 90
        });

        expect(specificDuration).to.equal('public, max-age=90');
    });

    it('should set cache control private at constructor level', function() {
        hc = new HTTPCache({
            proxy: 'private',
            unit: 'second',
            duration: 60
        });
        expect(hc.getHeader()).to.equal('private, max-age=60');
    });

    it('should set cache control private at method level', function() {
        hc = new HTTPCache({
            proxy: 'private',
            unit: 'second',
            duration: 60
        });

        var specificDuration = hc.getHeader({
            duration: 90
        });

        expect(specificDuration).to.equal('private, max-age=90');
    });

    it('should set no cache control at constructor level', function() {
        hc = new HTTPCache({
            duration: 0
        });
        expect(hc.getHeader()).to.equal('public, max-age=0');
    });

    it('should set no cache control at method level', function() {
        hc = new HTTPCache({
            duration: 1
        });

        var specificDuration = hc.getHeader({
            duration: 0
        });

        expect(specificDuration).to.equal('public, max-age=0');
    });

    it('should throw error if unit is unknow', function() {
        hc = new HTTPCache({
            unit: 'falseUnit'
        });
        expect(hc.getHeader.bind(hc)).to.throw('CacheControl unknown unit falseUnit');
    });

    it('should send no cache header', function() {
        hc = new HTTPCache({
            duration: -1
        });
        expect(hc.getHeader()).to.equal('no-cache');
    });

    it('should send max-age 0 cache header', function() {
        hc = new HTTPCache({
            duration: 0
        });
        expect(hc.getHeader()).to.equal('public, max-age=0');
    });

    it('should send max-age 0 cache header', function() {
        hc = new HTTPCache();
        expect(hc.getHeader()).to.equal('public, max-age=1');
    });

    it('should set header on middleware', function(done) {
        hc = new HTTPCache();
        var middleware = hc.middleware();
        middleware({}, res, function() {
            expect(res.header('Cache-Control')).to.equal('public, max-age=1');
            done();
        });
    });

    it('should set header on default middleware', function(done) {
        var middleware = httpCacheMiddleware();
        middleware({}, res, function() {
            expect(res.header('Cache-Control')).to.equal('public, max-age=1');
            done();
        });
    });

    it('should remove header on removeRevalidate', function() {
        hc = new HTTPCache();
        res.header('Etag', '1234');
        res.header('Last-Modified', '5678');
        hc.removeRevalidate(res);
        res.end();
        expect(res.header('Etag')).to.equal(undefined);
        expect(res.header('Last-Modified')).to.equal(undefined);
    });

    it('should no revalidate header on default middleware', function(done) {
        res.header('Etag', '1234');
        res.header('Last-Modified', '5678');
        var middleware = httpCacheMiddleware({noRevalidate: true});
        middleware({}, res, function() {
            res.end();
            expect(res.header('Etag')).to.equal(undefined);
            expect(res.header('Last-Modified')).to.equal(undefined);
            expect(res.header('Cache-Control')).to.equal('public, max-age=1');
            done();
        });
    });
});
