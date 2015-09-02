var findOrCreate = require("mongoose-findorcreate")
var mongoose = require('mongoose')

module.exports = function (connection) {
  var conversationSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    // sender of this message
    sender: { type: String },

    // recipient(s) of this message
    recipients: [ { type: String } ],

    state: { type: String }
  })

  conversationSchema.plugin(findOrCreate)

  return connection.model('Conversation', conversationSchema)
}
