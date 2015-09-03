var mongoose = require('mongoose')

module.exports = function (connection) {
  var messageSchema = new mongoose.Schema({
    // platform-dependent unique message identifier
    id: { type: String, required: true, index: true },

    // conversation this message belongs to
    conversation: { type: String, required: true, index: true },

    // sender of this message
    sender: { type: String },

    // recipient(s) of this message
    // recipients: [ { type: String } ],

    // reference to the original message this message is in response to (optional)
    replyToMessage: { type: String },

    text: { type: String },

    caption: { type: String },

    media: [
      {
        id: { type: String },

        url: { type: String },
        mime: { type: String },

        // image
        // video
        // audio
        // document
        type: { type: String },

        width: { type: Number },
        height: { type: Number },

        duration: { type: Number },
        thumbnail: { type: String },
      }
    ],

    created: { type: Date, index: true }
  })

  // provide access to largest media resolution by default
  messageSchema.virtual('defaultMedia').get(function () {
    var largestWidth = null
    var largest = null

    if (this.media) {
      this.media.forEach(function (photo) {
        if (!largestWidth || photo.width > largestWidth) {
          largestWidth = photo.width
          largest = photo
        }
      })
    }

    return largest
  })

  return connection.model('Message', messageSchema)
}
