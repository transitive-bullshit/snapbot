module.exports = ChatClient

var debug        = require('debug')('snapbot:chat-client')
var EventEmitter = require('events').EventEmitter
var inherits     = require('inherits')
var mongoose     = require('mongoose')
var reemit       = require('re-emitter')
var assert       = require('./assert')

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

  if (opts.connection) {
    self.connection = opts.connection
  } else {
    var dbHost = opts.dbHost || 'localhost'
    var dbName = (opts.dbName ? opts.dbName + '-' : '') + self.platform
    var mongoUri = 'mongodb://' + dbHost + '/' + dbName

    // keep-alive because there may be long periods of inactivity waiting for user input
    var connOpts = {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    }

    debug('ChatClient.mongoUri', mongoUri)
    self.connection = mongoose.createConnection(mongoUri, connOpts)
    reemit(self.connection, self, [ 'error' ])
  }

  self._debug = !!opts.debug
  self.assert = assert(self)
  mongoose.set(debug, self._debug)

  self.User         = require('../models/user')(self.connection)
  self.Message      = require('../models/message')(self.connection)
  self.Conversation = require('../models/conversation')(self.connection)
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
    this._debug = !!value
    mongoose.set(debug, this._debug)
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
  throw new Error('ChatClient.signIn is abstract', opts, cb)
}

ChatClient.prototype.getUpdates = function (opts, cb) {
  throw new Error('ChatClient.getUpdates is abstract', opts, cb)
}

ChatClient.prototype.getUpdatesPoll = function (opts, cb) {
  throw new Error('ChatClient.getUpdatesPoll is abstract', opts, cb)
}

ChatClient.prototype.getUpdatesWebhook = function (opts, cb) {
  throw new Error('ChatClient.getUpdatesWebhook is abstract', opts, cb)
}

ChatClient.prototype.getMe = function (opts, cb) {
  throw new Error('ChatClient.getMe is abstract', opts, cb)
}

ChatClient.prototype.sendMessage = function (opts, cb) {
  throw new Error('ChatClient.sendMessage is abstract', opts, cb)
}

ChatClient.prototype.sendPhoto = function (opts, cb) {
  throw new Error('ChatClient.sendPhoto is abstract', opts, cb)
}

ChatClient.prototype.sendVideo = function (opts, cb) {
  throw new Error('ChatClient.sendVideo is abstract', opts, cb)
}

ChatClient.prototype.getUser = function (opts, cb) {
  var self = this

  if (!(opts.username || opts.id || opts._id)) {
    throw new Error('ChatClient.getUser must provide either username, id, or _id')
  }

  var params = { }

  if (opts.username) params.username = opts.username
  if (opts.id) params.id = opts.id
  if (opts._id) params._id = opts._id

  self.User.findOne(params, cb)
}

ChatClient.prototype.getMessage = function (opts, cb) {
  var self = this

  if (!(opts.id || opts._id)) {
    throw new Error('ChatClient.getMessage must provide either id, or _id')
  }

  var params = { }

  if (opts.id) params.id = opts.id
  if (opts._id) params._id = opts._id

  self.Message.findOne(params, cb)
}

ChatClient.prototype.getConversation = function (opts, cb) {
  var self = this

  if (!(opts.id || opts._id)) {
    throw new Error('ChatClient.getConversation must provide either id, or _id')
  }

  var params = { }

  if (opts.id) params.id = opts.id
  if (opts._id) params._id = opts._id

  self.Conversation.findOne(params, cb)
}

ChatClient.prototype.destroy = function (cb) {
  var self = this

  if (self.connection) {
    self.connection.close(cb)
    self.connection = null
  }
}
