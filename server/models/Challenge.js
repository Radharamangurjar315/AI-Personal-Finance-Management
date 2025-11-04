const mongoose = require('mongoose');
const { CHALLENGE_TYPES, CHALLENGE_STATUS, POINTS } = require('../constants');

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(CHALLENGE_TYPES),
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  current: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: POINTS.CHALLENGE_BASE
  },
  status: {
    type: String,
    enum: Object.values(CHALLENGE_STATUS),
    default: CHALLENGE_STATUS.ACTIVE
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  completedAt: Date
});

module.exports = mongoose.model('Challenge', challengeSchema);
