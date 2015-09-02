var findOrCreate = require("mongoose-findorcreate")
var mongoose = require('mongoose')

module.exports = function (conn) {
  var conversationSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    // sender of this message
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderID: { type: String },

    // recipient(s) of this message
    recipients: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
    recipientIDs: [ { type: String } ],

    state: { type: String }
  })

  conversationSchema.plugin(findOrCreate)

  return conn.model('Conversation', conversationSchema)
}
