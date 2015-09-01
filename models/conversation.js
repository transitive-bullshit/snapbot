module.exports = function (mongoose) {
  var ConversationSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    messages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } ],
    messageIDs: [ { type: String } ],

    users: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
    userIDs: [ { type: String } ],

    state: { type: String }
  })

  return mongoose.model('Conversation', ConversationSchema)
}
