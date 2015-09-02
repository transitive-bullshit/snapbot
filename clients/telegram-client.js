module.exports = TelegramClient

var debug = require('debug')('snapbot:telegram-client')
var inherits = require('inherits')
var Telegram = require('node-telegram-bot')
var ChatClient = require('../lib/chat-client')
var utils = require('../lib/utils')

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

  utils.validateArgumentsCB(arguments, [
    {
      name: 'opts',
      type: Object,
      fields: {
        token: String
      }
    }
  ])

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

TelegramClient.prototype.getUser = function (opts, cb) {
  var self = this

  if (!(opts.username || opts.id)) {
    throw new Error('TelegramClient.getUser must provide either username or id')
  }

  var params = { }

  if (opts.username) params.username = opts.username
  if (opts.id) params.id = opts.id

  // telegram bots can only interact with users they've encountered so far, so
  // if the desired user isn't in the database, we don't have any way of
  // querying the API for a user which may exist elsewhere.
  self.User.findOne(params, cb)
}

TelegramClient.prototype.sendMessage = function (opts, cb) {
  var self = this

  if (!self.isSignedIn) {
    return cb('auth error; requires signIn')
  }

  utils.validateArgumentsCB(arguments, [
    {
      name: 'opts',
      type: Object,
      fields: {
        recipient: self.User,
        text: String,
        replyToMessage: self.Message
      }
    }
  ])

  var replyToMessage = opts.replyToMessage || { }

  self.client.sendMessage({
    'chat_id': opts.recipient.id,
    'text': opts.text,
    'reply_to_message_id': replyToMessage.id
  }, function (err, result) {
    if (err) return cb(err)

    self.assert.equal(result.from.id, self._user.id)
    self.assert.equal(result.chat.id, opts.recipient.id)
    self.assert.equal(result.text, opts.text)

    if (replyToMessage.id) {
      self.assert.equal(result['reply_to_message'].id, replyToMessage.id)
    }

    self.Conversation.findOrCreate({
      id: result.chat.id,

      sender: self._user._id,
      senderID: self._user.id,

      recipients: [ opts.recipient._id ],
      recipientIDs: [ opts.recipient.id ]
    }, function (err, conversation) {
      if (err) return cb(err)

      if (replyToMessage.id) {
        self.assert.equal(replyToMessage.conversation, conversation._id)
      }

      self.Message.create({
        id: result['message_id'],

        conversation: conversation._id,
        conversationID: conversation.id,

        sender: self._user._id,
        senderID: result.from.id,

        replyToMessage: replyToMessage._id,
        replyToMessageID: replyToMessage.id,

        text: opts.text,

        created: new Date(result.date)
      }, function (err, message) {
        if (!err) {
          self._lastMessageSent = message
        }

        return cb(err, message)
      })
    })
  })
}
