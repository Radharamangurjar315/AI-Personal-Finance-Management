const { v4: uuidv4 } = require('uuid');

/**
 * SavingsGoal Model
 * Represents a user's savings goal
 */
class SavingsGoal {
  constructor(userId, name, targetAmount, deadline, category = 'general') {
    this.id = uuidv4();
    this.userId = userId;
    this.name = name;
    this.targetAmount = targetAmount;
    this.currentAmount = 0;
    this.deadline = deadline;
    this.category = category;
    this.createdAt = new Date();
    this.completed = false;
  }

  addAmount(amount) {
    this.currentAmount += amount;
    if (this.currentAmount >= this.targetAmount) {
      this.completed = true;
      this.completedAt = new Date();
    }
  }

  getProgressPercentage() {
    return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
  }

  getDaysRemaining() {
    const now = new Date();
    const deadline = new Date(this.deadline);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

module.exports = SavingsGoal;
