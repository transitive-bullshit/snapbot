module.exports = ChatClient

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var User = require('../models/user')
var Message = require('../models/message')
var Conversation = require('../models/conversation')
var assert = require('./assert')

inherits(ChatClient, EventEmitter)

/**
 * ChatClient
 *
 * @class
 * @param {Object} opts
 */
function ChatClient (opts) {
  var self = this
  if (!(self instanceof ChatClient)) return new ChatClient(opts)
  if (!opts) opts = {}
  EventEmitter.call(self)

  if (!opts.mongoose) {
    throw new Error('opts.mongoose is required')
  }

  self._debug = !!opts.debug
  self.assert = assert(self)
  self.mongoose = opts.mongoose

  self.User = new User(opts.mongoose)
  self.Message = new Message(opts.mongoose)
  self.Conversation = new Conversation(opts.mongoose)
}

Object.defineProperty(ChatClient.prototype, 'platform', {
  get: function () {
    throw new Error('ChatClient.platform is abstract')
  }
})

Object.defineProperty(ChatClient.prototype, 'debug', {
  get: function () {
    return this._debug
  },

  set: function (value) {
    this._debug = value
  }
})

Object.defineProperty(ChatClient.prototype, 'isSignedIn', {
  get: function () {
    throw new Error('ChatClient.isSignedIn is abstract')
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

Object.defineProperty(ChatClient.prototype, 'lastMessageReceived', {
  get: function () {
    throw new Error('ChatClient.lastMessageReceived is abstract')
  }
})

Object.defineProperty(ChatClient.prototype, 'lastMessageSent', {
  get: function () {
    throw new Error('ChatClient.lastMessageSent is abstract')
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

ChatClient.prototype.getUser = function (opts, cb) {
  throw new Error('ChatClient.getUser is abstract')
}

ChatClient.prototype.sendMessage = function (opts, cb) {
  throw new Error('ChatClient.sendMessage is abstract')
}
