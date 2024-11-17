const mongoose = require('mongoose')

let Schema = mongoose.Schema

let UserSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  fullName: String,
  role: String,
})

module.exports = UserSchema
