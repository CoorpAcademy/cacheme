'use strict';
var expect      = require('chai').expect;
var index   = require('../lib/index');

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

describe('index', function() {
    it('should  expose cacheMe middleware', function(done) {
        var settedHeader = 'nevercalled';
        var res = {
            header: function(key, value) {
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

        var req = {
            originalUrl: '/test',
            method: 'get'
        };

        var middleware = index(options);
        middleware(req, res, function() {
            expect(settedHeader).to.equal('nevercalled');
            done();
        });
    });
});
