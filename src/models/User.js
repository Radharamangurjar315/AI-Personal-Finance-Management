const { v4: uuidv4 } = require('uuid');

// Constants
const POINTS_PER_LEVEL = 1000;

/**
 * User Model
 * Represents a user in the finance management system
 */
class User {
  constructor(name, email) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
    
    // Financial tracking
    this.transactions = [];
    this.income = [];
    this.savingsGoals = [];
    
    // Gamification attributes
    this.points = 0;
    this.level = 1;
    this.badges = [];
    this.achievements = [];
    this.activeChallenges = [];
    this.completedChallenges = [];
    
    // Social features
    this.friends = [];
    this.privacySettings = {
      shareProgress: true,
      showOnLeaderboard: true
    };
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  addIncome(income) {
    this.income.push(income);
  }

  addSavingsGoal(goal) {
    this.savingsGoals.push(goal);
  }

  awardPoints(points) {
    this.points += points;
    this.checkLevelUp();
  }

  checkLevelUp() {
    const newLevel = Math.floor(this.points / POINTS_PER_LEVEL) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      return true;
    }
    return false;
  }

  addBadge(badge) {
    if (!this.badges.find(b => b.id === badge.id)) {
      this.badges.push(badge);
    }
  }

  addAchievement(achievement) {
    if (!this.achievements.find(a => a.id === achievement.id)) {
      this.achievements.push(achievement);
    }
  }

  addChallenge(challenge) {
    this.activeChallenges.push(challenge);
  }

  completeChallenge(challengeId) {
    const index = this.activeChallenges.findIndex(c => c.id === challengeId);
    if (index !== -1) {
      const challenge = this.activeChallenges.splice(index, 1)[0];
      challenge.completedAt = new Date();
      this.completedChallenges.push(challenge);
      return challenge;
    }
    return null;
  }
}

module.exports = User;
