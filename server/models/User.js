const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: Date,
    icon: String
  }],
  savingsGoal: {
    target: Number,
    current: Number,
    deadline: Date,
    description: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  level: {
    type: Number,
    default: 1
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  }
});

module.exports = mongoose.model('User', userSchema);
