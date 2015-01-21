'use strict';
var expect      = require('chai').expect;
var HTTPCache   = require('../lib/httpCache').HTTPCache;

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
        var settedHeader;
        var res = {
            header: function(key, value) {
                settedHeader = key + ':' + value;
            }
        };
        var middleware = hc.middleware();
        middleware({}, res, function() {
            expect(settedHeader).to.equal('Cache-Control:public, max-age=1');
            done();
        });
    });
});
