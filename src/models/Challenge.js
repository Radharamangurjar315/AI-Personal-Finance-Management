const { v4: uuidv4 } = require('uuid');

/**
 * Challenge Model
 * Represents a personalized financial challenge
 */
class Challenge {
  constructor(title, description, type, target, reward, duration = 30) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.type = type; // 'savings', 'spending', 'streak', 'custom'
    this.target = target; // Target value to achieve
    this.current = 0; // Current progress
    this.reward = reward; // Points or badge
    this.duration = duration; // Duration in days
    this.createdAt = new Date();
    this.expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    this.completed = false;
  }

  updateProgress(value) {
    this.current = value;
    if (this.current >= this.target) {
      this.completed = true;
      this.completedAt = new Date();
    }
  }

  isExpired() {
    return new Date() > this.expiresAt;
  }

  getProgressPercentage() {
    return Math.min((this.current / this.target) * 100, 100);
  }
}

module.exports = Challenge;
