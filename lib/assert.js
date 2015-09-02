var assert = require('assert')

module.exports = function (self) {
  var shim = function () {
    if (self.debug) {
      assert.apply(assert, arguments)
    }
  }

  shim.equal = function () {
    if (self.debug) {
      assert.equal.apply(assert, arguments)
    }
  }

  return shim
}
