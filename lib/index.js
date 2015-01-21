'use strict';

/*!
 * cacheme
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

var CacheMe = require('./cacheMe');
var HTTPCache = require('./httpCache');

/**
 * Expose the middleware.
 */

exports = module.exports = CacheMe.middleware;

/**
 * Expose constructors.
 */

exports.CacheMe = CacheMe;
exports.HTTPCache = HTTPCache;
