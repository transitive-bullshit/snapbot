var findOrCreate = require("mongoose-findorcreate")
var mongoose = require('mongoose')

module.exports = function (connection) {
  var userSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    username: { type: String, required: true, index: true },

    displayName: { type: String }
  })

  userSchema.plugin(findOrCreate)

  return connection.model('User', userSchema)
}
