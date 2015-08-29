module.exports = ChatClient

var debug = require('debug')('snapbot:chat-client')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(ChatClient, EventEmitter)

/**
 * ChatClient
 *
 * @class
 * @param {Object} opts (currently unused)
 */
function ChatClient (opts) {
  var self = this
  if (!(self instanceof ChatClient)) return new ChatClient(opts)
  if (!opts) opts = {}
}

ChatClient.prototype.signIn = function (opts, cb) {
}

