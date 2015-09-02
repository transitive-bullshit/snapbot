var findOrCreate = require("mongoose-findorcreate")

module.exports = function (mongoose) {
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

  return mongoose.model('Conversation', conversationSchema)
}
