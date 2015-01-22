'use strict';
var expect      = require('chai').expect;
var cacheMeMiddleWare   = require('../lib/cacheMe');
var CacheMe   = cacheMeMiddleWare.CacheMe;

/*****
{
    "main.strategy": {
        "priority": 1, // lower is more important
        "rules":  [
            {
                "method": "get, post, put, del",
                "path":"regex",
                "cache": {
                    override: 'public, smax-age: 40',
                    proxy: 'public',
                    unit: 'second, minute, hour, month, year',
                    duration: 60
                }

            }
        ]
    }
}

*****/

describe('CacheMe', function() {
    var cm;
    var req;
    it('should not find strategy if empty', function() {
        cm = new CacheMe();
        expect(cm.check()).to.equal(false);
    });

    it('should return strategy', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: 'get',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal('cacheOption');
    });

    it('should not find strategy', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: 'get',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/test',
            method: 'get'
        };
        expect(cm.check(req)).to.equal(false);
    });

    it('should return priority strategy defined before', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: 'get',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            },
            'custom.strategy': {
                priority: 2, // greater is better
                rules:  [
                    {
                        method: 'get',
                        path: '^/$',
                        cache: 'cacheOption2'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal('cacheOption');
    });
    it('should return priority strategy defined after', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 2, // greater is better
                rules:  [
                    {
                        method: 'get',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            },
            'custom.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: 'get',
                        path: '^/$',
                        cache: 'cacheOption2'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal('cacheOption2');
    });

    it('should return wilcard method strategy', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: '*',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal('cacheOption');
    });

    it('should return default get method strategy', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal('cacheOption');
    });

    it('should not return different method strategy', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: 'put',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal(false);
    });

    it('should not return different method strategy', function() {
        cm = new CacheMe({
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: 'put',
                        path: '^/$',
                        cache: 'cacheOption'

                    }
                ]
            }
        });

        req = {
            originalUrl: '/',
            method: 'get'
        };
        expect(cm.check(req)).to.equal(false);
    });

    it('should set header on middleware', function(done) {
        var settedHeader;
        var res = {
            header: function(key, value) {
                settedHeader = key + ':' + value;
            },
            setHeader: function(key, value) {
                settedHeader = key + ':' + value;
            }
        };

        var options = {
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: '*',
                        path: '^/$',
                        cache: {
                            override: 'override'
                        }

                    }
                ]
            }
        };

        req = {
            originalUrl: '/',
            method: 'get'
        };

        var middleware = cacheMeMiddleWare(options);
        middleware(req, res, function() {
            expect(settedHeader).to.equal('Cache-Control:override');
            done();
        });
    });

    it('should not set header on middleware', function(done) {
        var settedHeader = 'nevercalled';
        var res = {
            header: function(key, value) {
                settedHeader = key + ':' + value;
            },
            setHeader: function(key, value) {
                settedHeader = key + ':' + value;
            }
        };

        var options = {
            'main.strategy': {
                priority: 1, // greater is better
                rules:  [
                    {
                        method: '*',
                        path: '^/$',
                        cache: {
                            override: 'override'
                        }

                    }
                ]
            }
        };

        req = {
            originalUrl: '/test',
            method: 'get'
        };

        var middleware = cacheMeMiddleWare(options);
        middleware(req, res, function() {
            expect(settedHeader).to.equal('nevercalled');
            done();
        });
    });
});
