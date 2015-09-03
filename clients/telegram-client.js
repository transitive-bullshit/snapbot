module.exports = TelegramClient

var debug      = require('debug')('snapbot:telegram-client')
var inherits   = require('inherits')
var async      = require('async')
var url        = require('url')
var path       = require('path')
var mime       = require('mime')
var request    = require('request')
var reemit     = require('re-emitter')
var Telegram   = require('node-telegram-bot')
var ChatClient = require('../lib/chat-client')
var utils      = require('../lib/utils')

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
      fields: {
        token: String
      }
    }
  ])

  self.client = new Telegram(opts)
  self.getMe(null, function (err, user) {
    if (err) return cb(err)

    self._startListeningForUpdates()
    return cb(null, user)
  })
}

TelegramClient.prototype._startListeningForUpdates = function () {
  var self = this

  if (!self.isSignedIn) {
    throw new Error('auth error; requires signIn')
  }

  reemit(self.client, self, [ 'error' ])
  self.client.on('error', function (err) {
    debug('TelegramClient:error %s', err)
  })

  self.client.on('message', function (message) {
    debug('TelegramClient:message %j', message)

    self._findOrCreateMessage(message, null, function (err, message) {
      if (err) {
        self.emit('error', err)
      } else {
        self._lastMessageReceived = message
        self.emit('message', message)
      }
    })
  })
}

TelegramClient.prototype.startUpdatesPoll = function (opts, cb) {
  var self = this

  self.client.start()
  process.nextTick(cb)
}

TelegramClient.prototype.startUpdatesWebhook = function (opts, cb) {
  var self = this

  if (self.client.polling) {
    throw new Error('TelegramClient.startUpdatesWebhook incompatible with startUpdatesPoll')
  }

  throw new Error('TODO: support telegram webhooks', opts, cb)
  process.nextTick(cb)
}

TelegramClient.prototype.stopUpdates = function (opts, cb) {
  var self = this

  self.client.stop()
  process.nextTick(cb)
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

  // telegram bots can only interact with users they've encountered so far, so
  // if the desired user isn't in the database, we don't have any way of
  // querying the API for a user which may exist elsewhere.
  ChatClient.prototype.getUser.call(self, opts, cb)
}

TelegramClient.prototype.sendMessage = function (opts, cb) {
  var self = this

  utils.validateArgumentsCB(arguments, [
    {
      name: 'opts',
      fields: {
        recipient: String,
        replyToMessage: {
          type: String,
          required: false
        },
        text: String
      }
    }
  ])

  self._sendMessage(self.client.sendMessage, {
    'chat_id': opts.recipient,
    'reply_to_message_id': opts.replyToMessage,
    'text': opts.text
  }, opts, cb)
}

TelegramClient.prototype.sendPhoto = function (opts, cb) {
  var self = this

  utils.validateArgumentsCB(arguments, [
    {
      name: 'opts',
      fields: {
        recipient: String,
        replyToMessage: {
          type: String,
          required: false
        },
        caption: {
          type: String,
          required: false
        },
        mediaURL: {
          type: String,
          required: false
        },
        mediaID: {
          type: String,
          required: false
        }
      }
    }
  ])

  var params = {
    'chat_id': opts.recipient,
    'reply_to_message_id': opts.replyToMessage,
    'caption': opts.caption,
    'file_id': opts.mediaID
  }

  function _sendMessage () {
    self._sendMessage(self.client.sendPhoto, params, opts, cb)
  }

  if (opts.mediaURL && !opts.mediaID) {
    var parsed = url.parse(opts.mediaURL)
    var filename = path.basename(parsed.pathname)

    params.files = {
      filename: filename,
      contentType: mime.lookup(filename),
      stream: request(opts.mediaURL, { encoding: null })
    }

    // send message with media stream attached as multipart/form-data
    _sendMessage()
  } else if (opts.mediaID) {
    // send message with pre-existing media
    _sendMessage()
  } else {
    throw new Error('TelegramClient.sendPhoto requires either opts.mediaURL or opts.mediaID')
  }
}

TelegramClient.prototype._sendMessage = function (method, params, opts, cb) {
  var self = this

  if (!self.isSignedIn) {
    return cb('auth error; requires signIn')
  }

  method.call(self.client, params, function (err, result) {
    if (err) return cb(err)

    self.assert.equal(result.from.id, self._user.id)
    self.assert.equal(result.chat.id, opts.recipient)
    self.assert.equal(result.text, opts.text)

    if (opts.replyToMessage) {
      self.assert.equal(result['reply_to_message'].id, opts.replyToMessage)
    }

    self._findOrCreateMessage(result, opts, function (err, message) {
      if (!err) {
        self._lastMessageSent = message
      }

      return cb(err, message)
    })
  })
}

TelegramClient.prototype._findOrCreateUser = function (user, cb) {
  debug('TelegramClient._findOrCreateUser %j', user)
  var self = this

  self.User.findOne({
    id: user.id
  }, function (err, doc) {
    if (err) return cb(err)
    if (doc) return cb(null, doc)

    var params = {
      id: user.id,
      username: user.username
    }

    if (user.title) {
      params.displayName = user.title
    } else if (user['first_name']) {
      params.displayName = user['first_name']

      if (user['last_name']) {
        params.displayName += ' ' + user['last_name']
      }
    }

    self.User.create(params, cb)
  })
}

TelegramClient.prototype._findOrCreateMessage = function (message, opts, cb) {
  var self = this
  opts = opts || { }

  async.parallel([
    function (cb) {
      self._findOrCreateUser(message.from, cb)
    },

    function (cb) {
      self.Conversation.findOrCreate({
        id: message.chat.id
      }, cb)
    },

    function (cb) {
      self.Message.findOne({
        id: message['message_id']
      }, function (err, doc) {
        if (err) return cb(err)
        if (doc) return cb(null, doc)

        var replyToMessage = message['reply_to_message']
        replyToMessage = replyToMessage && replyToMessage.id

        var messageParams = {
          id: message['message_id'],
          conversation: message.chat.id,
          sender: message.from.id,
          replyToMessage: replyToMessage,
          text: message.text,
          created: new Date(message.date * 1000),
          caption: message.caption
        }

        if (message.photo) {
          messageParams.media = message.photo.map(function (photo) {
            self.assert(photo['file_id'])

            var image = {
              id: photo['file_id'],
              type: 'image',
              width: photo.width,
              height: photo.height
            }

            if (opts.mediaURL) {
              image.url = opts.mediaURL
            }

            return image
          })
        }

        self.Message.create(messageParams, cb)
      })
    }
  ], function (err, results) {
    if (err) return cb(err)
    return cb(null, results[results.length - 1])
  })
}
