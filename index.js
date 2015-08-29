module.exports = Platform

var debug = require('debug')('snapbot:platform')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Platform, EventEmitter)

/**
 * Platform
 *
 * @class
 * @param {Object} opts (currently unused)
 */
function Platform (opts) {
  var self = this
  if (!(self instanceof Platform)) return new Platform(opts)
  if (!opts) opts = {}
}

Platform.prototype.signIn = function (opts, cb) {
}
