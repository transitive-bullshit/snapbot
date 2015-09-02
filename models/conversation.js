var findOrCreate = require("mongoose-findorcreate")

module.exports = function (mongoose) {
  var conversationSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    messages: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Message' } ],
    messageIDs: [ { type: String } ],

    users: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
    userIDs: [ { type: String } ],

    state: { type: String }
  })

  conversationSchema.plugin(findOrCreate)

  return mongoose.model('Conversation', conversationSchema)
}
