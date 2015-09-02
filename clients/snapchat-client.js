module.exports = SnapchatClient

var debug = require('debug')('snapbot:snapchat-client')
var inherits = require('inherits')
var Snapchat = require('snapchat')
var ChatClient = require('../lib/chat-client')

inherits(SnapchatClient, ChatClient)

/**
 * SnapchatClient
 *
 * @class
 * @param {Object} opts
 */
function SnapchatClient (opts) {
  var self = this
  if (!(self instanceof SnapchatClient)) return new SnapchatClient(opts)
  ChatClient.call(self, opts)

  self.client = new Snapchat(opts)
}

Object.defineProperty(ChatClient.prototype, 'platform', {
  get: function () { return 'snapchat' }
})

Object.defineProperty(ChatClient.prototype, 'isSignedIn', {
  get: function () { return this.client.isSignedIn }
})

Object.defineProperty(ChatClient.prototype, 'username', {
  get: function () { return this.client.username }
})

Object.defineProperty(ChatClient.prototype, 'user', {
  // cached
  get: function () { return this._user }
})

SnapchatClient.prototype.signIn = function (opts, cb) {
  var self = this

  self.client.signIn(function (err) {
    if (err) {
      return cb(err)
    } else {
      self._update(cb)
    }
  })
}

SnapchatClient.prototype._update = function (cb) {
  var self = this
  if (!self.isSignedIn) {
    return cb('auth error; signIn required')
  }

  var session = self.client.session

  self._user = self.User.findOrCreate({
    id: session.userIdentifier,
    username: session.username
  }, cb)
}

SnapchatClient.prototype.getUpdates = function (opts, cb) {
  var self = this
  throw new Error('TODO')
}

SnapchatClient.prototype.getUpdatesPoll = function (opts, cb) {
  throw new Error('TODO')
}

SnapchatClient.prototype.getUpdatesWebhook = function (opts, cb) {
  throw new Error('TODO')
}

SnapchatClient.prototype.getFriends = function (opts, cb) {
  throw new Error('TODO')
}

SnapchatClient.prototype.getConversations = function (opts, cb) {
  throw new Error('TODO')
}

SnapchatClient.prototype.getMe = function (opts, cb) {
  throw new Error('TODO')
}

SnapchatClient.prototype.sendMessage = function (opts, cb) {
  throw new Error('TODO')
}

SnapchatClient.prototype.sendPhoto = function (opts, cb) {
  throw new Error('TODO')
}
