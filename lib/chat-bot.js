module.exports = ChatBot

var debug = require('debug')('snapbot:chat-bot')

/**
 * ChatBot
 *
 * @class
 * @param {Object} opts
 */
function ChatBot (client, state, opts) {
  var self = this
  if (!(self instanceof ChatBot)) return new ChatBot(client, state, opts)
  if (!opts) opts = {}
}

ChatBot.prototype.start = function () {
  throw new Error('ChatBot.start is abstract')
}

ChatBot.prototype.stop = function () {
  throw new Error('ChatBot.stop is abstract')
}
