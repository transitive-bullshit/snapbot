var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
  id: { type: String, required: true, index: true },

  username: { type: String, required: true, index: true },

  displayName: { type: String }
})

module.exports = mongoose.model('User', UserSchema)
