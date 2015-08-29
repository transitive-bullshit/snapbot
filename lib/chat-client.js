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

Object.defineProperty(ChatClient.prototype, 'platform', {
  get: function () { return this._platform }
})

Object.defineProperty(ChatClient.prototype, 'username', {
  get: function () { return this._username }
})

Object.defineProperty(ChatClient.prototype, 'user', {
  get: function () { return this._user }
})

Object.defineProperty(ChatClient.prototype, 'friends', {
  get: function () { return this._friends }
})

Object.defineProperty(ChatClient.prototype, 'conversations', {
  get: function () { return this._conversations }
})

ChatClient.prototype.signIn = function (opts, cb) {
}

ChatClient.prototype.getUpdates = function (opts, cb) {
}

ChatClient.prototype.getUpdatesPoll = function (opts, cb) {
}

ChatClient.prototype.getUpdatesWebhook = function (opts, cb) {
}

ChatClient.prototype.getFriends = function (opts, cb) {
}

ChatClient.prototype.getConversations = function (opts, cb) {
}

ChatClient.prototype.getMe = function (opts, cb) {
}

ChatClient.prototype.sendMessage = function (opts, cb) {
}

ChatClient.prototype.sendPhoto = function (opts, cb) {
}

ChatClient.prototype.sendVideo = function (opts, cb) {
}

