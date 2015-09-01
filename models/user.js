module.exports = function (mongoose) {
  var UserSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    username: { type: String, required: true, index: true },

    displayName: { type: String }
  })

  return mongoose.model('User', UserSchema)
}
