module.exports = TestBot

var debug = require('debug')('snapbot:test-bot')

/**
 * TestBot
 *
 * @class
 * @param {Object} opts
 */
function TestBot (client, opts) {
  var self = this
  if (!(self instanceof TestBot)) return new TestBot(client, opts)
  if (!opts) opts = {}
}

TestBot.prototype.start = function () {
  // TODO
}

TestBot.prototype.stop = function () {
  // TODO
}
