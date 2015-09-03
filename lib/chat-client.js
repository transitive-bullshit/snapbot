module.exports = ChatClient

var debug        = require('debug')('snapbot:chat-client')
var EventEmitter = require('events').EventEmitter
var inherits     = require('inherits')
var mongoose     = require('mongoose')
var reemit       = require('re-emitter')
var assert       = require('./assert')

inherits(ChatClient, EventEmitter)

/**
 * An abstract client interface for any chat messaging platform such as:
 * Telegram, Kik, Snapchat, iMessage, etc.
 *
 * Note: platform-specific subclasses may require more initialization options.
 *
 * @class
 * @param {Object=} opts
 * @param {Object=}  opts.connection Optional mongoose connection
 * @param {String=}  opts.dbHost     Optional mongodb host (defaults to localhost)
 * @param {String=}  opts.dbName     Optional mongodb database name (defaults to ChatClient.platform)
 * @param {Boolean=} opts.debug      Optionally enables internal consistency assertions
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

/**
 * Name of the platform
 *
 * @name ChatClient#platform
 * @property {String}
 * @abstract
 * @readonly
 */
Object.defineProperty(ChatClient.prototype, 'platform', {
  get: function () {
    throw new Error('ChatClient.platform is abstract')
  }
})

/**
 * Whether or not to enable internal assertions.
 *
 * @name ChatClient#debug
 * @property {Boolean}
 */
Object.defineProperty(ChatClient.prototype, 'debug', {
  get: function () {
    return this._debug
  },

  set: function (value) {
    this._debug = !!value
    mongoose.set(debug, this._debug)
  }
})

/**
 * Whether or not this client is currently signed in.
 *
 * @name ChatClient#isSignedIn
 * @property {Boolean}
 * @abstract
 * @readonly
 */
Object.defineProperty(ChatClient.prototype, 'isSignedIn', {
  get: function () {
    throw new Error('ChatClient.isSignedIn is abstract')
  }
})

/**
 * Username of user currently signed in.
 *
 * @name ChatClient#username
 * @property {String}
 * @abstract
 * @readonly
 */
Object.defineProperty(ChatClient.prototype, 'username', {
  get: function () {
    throw new Error('ChatClient.username is abstract')
  }
})

/**
 * User currently signed in.
 *
 * @name ChatClient#user
 * @property {User}
 * @abstract
 * @readonly
 */
Object.defineProperty(ChatClient.prototype, 'user', {
  get: function () {
    throw new Error('ChatClient.user is abstract')
  }
})

/**
 * The last message this client received.
 *
 * @name ChatClient#lastMessageReceived
 * @property {Message}
 * @abstract
 * @readonly
 */
Object.defineProperty(ChatClient.prototype, 'lastMessageReceived', {
  get: function () {
    throw new Error('ChatClient.lastMessageReceived is abstract')
  }
})

/**
 * The last message this client sent.
 *
 * @name ChatClient#lastMessageSent
 * @property {Message}
 * @abstract
 * @readonly
 */
Object.defineProperty(ChatClient.prototype, 'lastMessageSent', {
  get: function () {
    throw new Error('ChatClient.lastMessageSent is abstract')
  }
})

/**
 * Signs into an account. Requires platform-specific auth parameters in opts.
 *
 * @abstract
 * @param {Object} opts
 * @param {Function} cb
 */
ChatClient.prototype.signIn = function (opts, cb) {
  throw new Error('ChatClient.signIn is abstract', opts, cb)
}

/**
 * Starts polling for updates.
 * Will emit 'message' and 'error' events.
 * Note that startUpdatesPoll and startUpdatesWebhook are mutually exclusive.
 *
 * @abstract
 * @param {Object} opts
 * @param {Function} cb
 */
ChatClient.prototype.startUpdatesPoll = function (opts, cb) {
  throw new Error('ChatClient.startUpdatesPoll is abstract', opts, cb)
}

/**
 * Starts listening to updates via a local webhook.
 * Will emit 'message' and 'error' events.
 * Note that startUpdatesPoll and startUpdatesWebhook are mutually exclusive.
 *
 * @abstract
 * @param {Object} opts
 * @param {Function} cb
 */
ChatClient.prototype.startUpdatesWebhook = function (opts, cb) {
  throw new Error('ChatClient.startUpdatesWebhook is abstract', opts, cb)
}

/**
 * Stops listening for updates either via polling or webhook.
 *
 * @abstract
 * @param {Object} opts
 * @param {Function} cb
 */
ChatClient.prototype.stopUpdates = function (opts, cb) {
  throw new Error('ChatClient.stopUpdates is abstract', opts, cb)
}

/**
 * Sends a new UTF8 text-based message to a recipient or group.
 *
 * @abstract
 * @param {Object} opts
 * @param {String}  opts.recipient      Platform-specific ID of message recipient or group.
 * @param {String=} opts.replyToMessage Optional platform-specific ID of message this message is in response to.
 * @param {String}  opts.text           Textual message content.
 * @param {Function} cb
 */
ChatClient.prototype.sendMessage = function (opts, cb) {
  throw new Error('ChatClient.sendMessage is abstract', opts, cb)
}

/**
 * Sends a new photo message to a recipient or group.
 * Requires either opts.mediaURL or opts.mediaID.
 *
 * @abstract
 * @param {Object} opts
 * @param {String}  opts.recipient      Platform-specific ID of message recipient or group.
 * @param {String=} opts.replyToMessage Optional platform-specific ID of message this message is in response to.
 * @param {String=} opts.caption        Optional text caption for photo.
 * @param {String=} opts.mediaURL       Optional URL of photo to send.
 * @param {String=} opts.mediaID        Optional platform-specific ID of pre-existing photo to send.
 * @param {Function} cb
 */
ChatClient.prototype.sendPhoto = function (opts, cb) {
  throw new Error('ChatClient.sendPhoto is abstract', opts, cb)
}

/**
 * Sends a new video message to a recipient or group.
 * Requires either opts.mediaURL or opts.mediaID.
 *
 * @abstract
 * @param {Object} opts
 * @param {String}  opts.recipient      Platform-specific ID of message recipient or group.
 * @param {String=} opts.replyToMessage Optional platform-specific ID of message this message is in response to.
 * @param {String=} opts.caption        Optional text caption for photo.
 * @param {String=} opts.mediaURL       Optional URL of video to send.
 * @param {String=} opts.mediaID        Optional platform-specific ID of pre-existing video to send.
 * @param {Function} cb
 */
ChatClient.prototype.sendVideo = function (opts, cb) {
  throw new Error('ChatClient.sendVideo is abstract', opts, cb)
}

/**
 * Queries the platform for the currently signed-in user. Note that this updates
 * ChatClient.user which is a cached version of what this method returns.
 *
 * @abstract
 * @param {Object} opts
 * @param {Function} cb
 */
ChatClient.prototype.getMe = function (opts, cb) {
  throw new Error('ChatClient.getMe is abstract', opts, cb)
}

/**
 * Queries the local cache and/or the patform for the given user.
 * Requires one of opts.username, opts.id, or opts._id
 *
 * @param {Object} opts
 * @param {String=} opts.username Platform-dependent username of the user to query.
 * @param {String=} opts.id       Platform-dependent unique identifier of the user to query.
 * @param {String=} opts._id      Platform-independent local mongo identifier of the user to query.
 * @param {Function} cb
 */
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

/**
 * Queries the local cache and/or the lpatform for the given message.
 * Requires one of opts.id, or opts._id
 *
 * @param {Object} opts
 * @param {String=} opts.id       Platform-dependent unique identifier of the message to query.
 * @param {String=} opts._id      Platform-independent local mongo identifier of the message to query.
 * @param {Function} cb
 */
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

/**
 * Queries the local cache and/or the lpatform for the given conversation.
 * Requires one of opts.id, or opts._id
 *
 * @param {Object} opts
 * @param {String=} opts.id       Platform-dependent unique identifier of the conversation to query.
 * @param {String=} opts._id      Platform-independent local mongo identifier of the conversation to query.
 * @param {Function} cb
 */
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

/**
 * Closes this client's database connection and invalidates it for further use.
 *
 * @param {Function} cb
 */
ChatClient.prototype.destroy = function (cb) {
  var self = this

  if (self.connection) {
    self.connection.close(cb)
    self.connection = null
  }
}
