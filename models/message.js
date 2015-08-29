var mongoose = require('mongoose')

var MessageSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipients: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],

  text: { type: String },

  media: {
    url: { type: String },
    mime: { type: String },

    width: { type: Number },
    height: { type: Number },

    duration: { type: Number },
    thumbnail: { type: String }
  },

  // text
  // image
  // video
  // audio
  type: { type: String },

  created: { type: Date, index: true }
})

module.exports = mongoose.model('Message', MessageSchema)
