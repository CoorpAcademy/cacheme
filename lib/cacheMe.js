'use strict';

var HTTPCache = require('./httpCache').HTTPCache;
var debug = require('debug')('cacheme:cacheMe');
var _ = require('lodash');

function CacheMe(options) {
    this.httpCache = new HTTPCache();
    this.rulesStrategies = [];
    for (var propertyName in options) {
        if (options.hasOwnProperty(propertyName)) {
            debug(options[propertyName]);
            this.rulesStrategies.push(options[propertyName]);
        }
    }

    this.rules = _(this.rulesStrategies)
        .sortBy('priority')
        .flatten(this.rulesStrategy, 'rules')
        .value()
    ;

    debug('this.rules', this.rules);
}

CacheMe.prototype.check = function(req) {
    var ruleCount = this.rules.length;
    debug(ruleCount + 'to check');
    // use traditional for loop to be able to break it with return
    for (var i = 0; i < ruleCount; i++) {
        var rule = this.rules[i];
        if (req.originalUrl.match(rule.path)) {
            rule.method = rule.method || 'get';
            // no specific method defined on rule or method defined and req.method matching
            if (rule.method === '*' || rule.method === req.method) {
                debug('rule match: ' + rule.path + ' [' + req.method + ' ' + req.originalUrl + ']');
                return rule.cache;
            }
        }
        debug('rule don\'t match: ' + rule.path + ' [' + req.method + ' ' + req.originalUrl + ']');
    }

    return false;
};

CacheMe.prototype.middleware = function() {
    return function(req, res, next) {
        var option = this.check(req);
        if (option) {
            debug('this', this);
            this.httpCache.setHeader(res, option);
        }
        next();
    }.bind(this);
};

var middleware = function(options) {
    return new CacheMe(options).middleware();
};

/**
 * Expose the middleware.
 */

module.exports = middleware;

/*
 * Expose constructor.
 */

module.exports.CacheMe = CacheMe;
