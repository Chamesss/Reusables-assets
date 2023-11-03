const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true, minlength: 4, maxlength: 255 }
});

module.exports = mongoose.model('User', userSchema);