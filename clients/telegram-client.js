module.exports = TelegramClient

var debug = require('debug')('snapbot:telegram-client')
var inherits = require('inherits')
var Telegram = require('node-telegram-bot')
var ChatClient = require('../lib/chat-client')

inherits(TelegramClient, ChatClient)

/**
 * TelegramClient
 *
 * @class
 * @param {Object} opts
 */
function TelegramClient (opts) {
  var self = this
  if (!(self instanceof TelegramClient)) return new TelegramClient(opts)
  ChatClient.call(self, opts)

  self.client = null
}

Object.defineProperty(ChatClient.prototype, 'platform', {
  get: function () { return 'telegram' }
})

Object.defineProperty(ChatClient.prototype, 'isSignedIn', {
  get: function () { return this.client && this._user }
})

Object.defineProperty(ChatClient.prototype, 'username', {
  get: function () { return this._user && this._user.username }
})

Object.defineProperty(ChatClient.prototype, 'user', {
  // cached
  get: function () { return this._user }
})

TelegramClient.prototype.signIn = function (opts, cb) {
  var self = this

  if (!opts.token) {
    throw new Error('telegram bot token required')
  }

  self.client = new Telegram(opts)
  self.getMe(null, cb)
}

TelegramClient.prototype.getUpdates = function (opts, cb) {
  var self = this
  throw new Error('TODO')
}

TelegramClient.prototype.getUpdatesPoll = function (opts, cb) {
  throw new Error('TODO')
}

TelegramClient.prototype.getUpdatesWebhook = function (opts, cb) {
  throw new Error('TODO')
}

TelegramClient.prototype.getFriends = function (opts, cb) {
  throw new Error('TODO')
}

TelegramClient.prototype.getConversations = function (opts, cb) {
  throw new Error('TODO')
}

TelegramClient.prototype.getMe = function (opts, cb) {
  var self = this

  if (!self.client) {
    return cb('auth error; requires signIn')
  }

  self.client.getMe(function (err, result) {
    if (err) {
      return cb(err)
    }

    self.User.findOrCreate({
      id: result.id,
      username: result.username
    }, function (err, user) {
      self._user = user
      return cb(err, user)
    })
  })
}

TelegramClient.prototype.sendMessage = function (opts, cb) {
  throw new Error('TODO')
}

TelegramClient.prototype.sendPhoto = function (opts, cb) {
  throw new Error('TODO')
}
