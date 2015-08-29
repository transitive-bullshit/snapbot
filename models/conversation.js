var mongoose = require('mongoose')

var ConversationSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },

  messages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } ],
  messageIDs: [ { type: String } ],

  users: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
  userIDs: [ { type: String } ],

  state: { type: String }
})

module.exports = mongoose.model('Conversation', ConversationSchema)
