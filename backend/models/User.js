const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  }
});

// Add index for better query performance
userSchema.index({ uid: 1 });

module.exports = mongoose.model('User', userSchema)