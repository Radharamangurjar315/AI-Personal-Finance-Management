const { v4: uuidv4 } = require('uuid');

/**
 * Transaction Model
 * Represents a financial transaction (expense)
 */
class Transaction {
  constructor(userId, amount, category, description, date = new Date()) {
    this.id = uuidv4();
    this.userId = userId;
    this.amount = amount;
    this.category = category;
    this.description = description;
    this.date = date;
    this.createdAt = new Date();
  }
}

module.exports = Transaction;
