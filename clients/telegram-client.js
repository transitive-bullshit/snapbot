module.exports = TelegramClient

var debug = require('debug')('snapbot:telegram-client')
var assert = require('assert')
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

Object.defineProperty(TelegramClient.prototype, 'platform', {
  get: function () { return 'telegram' }
})

Object.defineProperty(TelegramClient.prototype, 'isSignedIn', {
  get: function () { return this.client && this._user }
})

Object.defineProperty(TelegramClient.prototype, 'username', {
  get: function () { return this._user && this._user.username }
})

Object.defineProperty(TelegramClient.prototype, 'user', {
  // cached
  get: function () { return this._user }
})

Object.defineProperty(TelegramClient.prototype, 'lastMessageReceived', {
  get: function () { return this._lastMessageReceived }
})

Object.defineProperty(TelegramClient.prototype, 'lastMessageSent', {
  get: function () { return this._lastMessageSent }
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
  var self = this

  if (!self.isSignedIn) {
    return cb('auth error; requires signIn')
  }

  opts.conversation
  opts.replyToMessage
  opts.recipient

  self.client.sendMessage({
    'chat_id': opts.recipient.id,
    'text': opts.text,
    'reply_to_message_id': opts.replyToMessage.id
  }, function (err, result) {
    if (err) return cb(err)

    if (self.debug) {
      assert.equal(result.from.id, self._user.id)
      //assert.equal(result.chat.id, opts.conversation.id)
    }

    self.Message.create({
      id: result['message_id'],

      conversation: opts.conversation._id,
      conversationID: opts.conversation.id,

      sender: self._user._id,
      senderID: result.from.id,

      recipients:
    }, function (err, message) {
      if (!err) {
        self._lastMessageSent = message
      }

      return cb(err, message)
    })
  })
}

TelegramClient.prototype.sendPhoto = function (opts, cb) {
  throw new Error('TODO')
}
