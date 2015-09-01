module.exports = ChatClient

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var User = require('../models/user')
var Message = require('../models/message')
var Conversation = require('../models/conversation')

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
  EventEmitter.call(self)

  self.User = new User(opts.mongoose)
  self.Message = new Message(opts.mongoose)
  self.Conversation = new Conversation(opts.mongoose)
}

Object.defineProperty(ChatClient.prototype, 'platform', {
  get: function () {
    throw new Error('ChatClient.platform is abstract')
  }
})

Object.defineProperty(ChatClient.prototype, 'username', {
  get: function () {
    throw new Error('ChatClient.username is abstract')
  }
})

Object.defineProperty(ChatClient.prototype, 'user', {
  get: function () {
    throw new Error('ChatClient.user is abstract')
  }
})

Object.defineProperty(ChatClient.prototype, 'friends', {
  get: function () {
    throw new Error('ChatClient.friends is abstract')
  }
})

Object.defineProperty(ChatClient.prototype, 'conversations', {
  get: function () {
    throw new Error('ChatClient.conversations is abstract')
  }
})

ChatClient.prototype.signIn = function (opts, cb) {
  throw new Error('ChatClient.signIn is abstract')
}

ChatClient.prototype.getUpdates = function (opts, cb) {
  throw new Error('ChatClient.getUpdates is abstract')
}

ChatClient.prototype.getUpdatesPoll = function (opts, cb) {
  throw new Error('ChatClient.getUpdatesPoll is abstract')
}

ChatClient.prototype.getUpdatesWebhook = function (opts, cb) {
  throw new Error('ChatClient.getUpdatesWebhook is abstract')
}

ChatClient.prototype.getFriends = function (opts, cb) {
  throw new Error('ChatClient.getFriends is abstract')
}

ChatClient.prototype.getConversations = function (opts, cb) {
  throw new Error('ChatClient.getConversations is abstract')
}

ChatClient.prototype.getMe = function (opts, cb) {
  throw new Error('ChatClient.getMe is abstract')
}

ChatClient.prototype.sendMessage = function (opts, cb) {
  throw new Error('ChatClient.sendMessage is abstract')
}

ChatClient.prototype.sendPhoto = function (opts, cb) {
  throw new Error('ChatClient.sendPhoto is abstract')
}

ChatClient.prototype.sendVideo = function (opts, cb) {
  throw new Error('ChatClient.sendVideo is abstract')
}
