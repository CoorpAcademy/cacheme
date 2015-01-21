'use strict';

var _ = require('lodash');
var debug = require('debug')('cacheme:httpCache');

var headerKey = 'Cache-Control';
var noCacheKey = 'no-cache';
var maxAgeKey = 'max-age';
var proxyDefaultKey = 'public';

var units = {};
units.second = 1;
units.minute = units.second * 60;
units.hour = units.minute * 60;
units.day = units.hour * 24;
units.week = units.day * 7;
units.month = units.day * 30;
units.year = units.day * 365;

// add plural units
Object.keys(units).forEach(function(unit) {
    units[unit + 's'] = units[unit];
});

function HTTPCache(options) {
    this.options = _.defaults(options || {}, {unit: 'second'});
    debug('this.options', this.options);
}

HTTPCache.prototype.calculate =  function(unit, value) {
    if (value < 0) {
        return value;
    }
    if (unit === 0 || value === 0 || unit === false) {
        return 0;
    }

    var unitValue = units[unit];
    if (!unitValue) {
        throw new Error('CacheControl unknown unit ' + unit);
    }

    // default to 1 (unless it is 0 which we already checked) so they can cache("day")
    if (!value) {
        value = 1;
    }

    return unitValue * value;
};

HTTPCache.prototype.middleware = function(options) {
    return function(req, res, next) {
        this.setHeader(res, options);
        next();
    }.bind(this);
};

HTTPCache.prototype.getHeader = function(options) {
    debug('options', options);
    debug('this.options', this.options);
    var localOptions = _.defaults(options || {}, this.options);
    debug('localOptions', localOptions);

    if (localOptions.override) {
        return localOptions.override;
    }
    var  seconds = this.calculate(localOptions.unit, localOptions.duration);

    if (seconds < 0) {
        return noCacheKey;
    }
    else {
        return (localOptions.proxy || proxyDefaultKey) + ', ' + maxAgeKey + '=' + seconds;
    }
};

HTTPCache.prototype.setHeader = function(res, options) {
    res.header(headerKey, this.getHeader(options));
};

var middleware = function(options) {
    return new HTTPCache(options).middleware();
};

/**
 * Expose the middleware.
 */

module.exports = middleware;

/*
 * Expose constructor.
 */

module.exports.HTTPCache = HTTPCache;
