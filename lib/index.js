'use strict';

/*!
 * cacheme
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

var cacheMeMiddleware = require('./cacheMe');
var CacheMe = cacheMeMiddleware.CacheMe;
var HTTPCache = require('./httpCache');

/**
 * Expose the middleware.
 */

exports = module.exports = cacheMeMiddleware;

/**
 * Expose constructors.
 */

exports.CacheMe = CacheMe;
exports.HTTPCache = HTTPCache;
