var findOrCreate = require("mongoose-findorcreate")

module.exports = function (mongoose) {
  var userSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true },

    username: { type: String, required: true, index: true },

    displayName: { type: String }
  })

  userSchema.plugin(findOrCreate)

  return mongoose.model('User', userSchema)
}
