module.exports = TestBot

var debug = require('debug')('snapbot:test-bot')

/**
 * TestBot
 *
 * @class
 * @param {Object} opts
 */
function TestBot (client, state, opts) {
  var self = this
  if (!(self instanceof TestBot)) return new TestBot(client, state, opts)
  if (!opts) opts = {}
}

TestBot.prototype.start = function () {
}

TestBot.prototype.stop = function () {
}
