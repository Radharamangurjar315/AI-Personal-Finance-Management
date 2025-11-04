const mongoose = require('mongoose');
const { TRANSACTION_TYPES, TRANSACTION_SOURCES } = require('../constants');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPES),
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  source: {
    type: String,
    enum: Object.values(TRANSACTION_SOURCES),
    default: TRANSACTION_SOURCES.MANUAL
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
