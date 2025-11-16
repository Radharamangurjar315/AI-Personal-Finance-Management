const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SavingsGoal = require('../models/SavingsGoal');
const spendingAnalysisService = require('../services/SpendingAnalysisService');
const gamificationService = require('../services/GamificationService');
const challengeService = require('../services/ChallengeService');

/**
 * FinanceController
 * Main controller for finance management operations
 */
class FinanceController {
  constructor() {
    this.users = new Map(); // In-memory storage (would use database in production)
  }

  /**
   * Create a new user
   */
  createUser(name, email) {
    const user = new User(name, email);
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Get user by ID
   */
  getUser(userId) {
    return this.users.get(userId);
  }

  /**
   * Get all users
   */
  getAllUsers() {
    return Array.from(this.users.values());
  }

  /**
   * Add a transaction
   */
  addTransaction(userId, amount, category, description, date) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const transaction = new Transaction(userId, amount, category, description, date);
    user.addTransaction(transaction);

    // Award points for adding transaction
    gamificationService.awardPoints(user, 'addTransaction');

    // Check for achievements
    const newAchievements = gamificationService.checkAchievements(user);

    return { transaction, newAchievements };
  }

  /**
   * Get user transactions
   */
  getTransactions(userId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.transactions;
  }

  /**
   * Add a savings goal
   */
  addSavingsGoal(userId, name, targetAmount, deadline, category) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const goal = new SavingsGoal(userId, name, targetAmount, deadline, category);
    user.addSavingsGoal(goal);

    // Check for achievements
    const newAchievements = gamificationService.checkAchievements(user);

    return { goal, newAchievements };
  }

  /**
   * Update savings goal progress
   */
  updateSavingsGoal(userId, goalId, amount) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const goal = user.savingsGoals.find(g => g.id === goalId);
    if (!goal) {
      throw new Error('Savings goal not found');
    }

    goal.addAmount(amount);

    if (goal.completed) {
      gamificationService.awardPoints(user, 'reachSavingsGoal');
      const newAchievements = gamificationService.checkAchievements(user);
      return { goal, completed: true, newAchievements };
    }

    return { goal, completed: false };
  }

  /**
   * Get spending analysis
   */
  getSpendingAnalysis(userId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const transactions = user.transactions;
    
    return {
      categoryBreakdown: spendingAnalysisService.analyzeByCategory(transactions),
      totalSpending: transactions.reduce((sum, t) => sum + t.amount, 0),
      averageDailySpending: spendingAnalysisService.calculateAverageDailySpending(transactions),
      trends: spendingAnalysisService.identifyTrends(transactions),
      insights: spendingAnalysisService.generateInsights(user),
      anomalies: spendingAnalysisService.identifyAnomalies(transactions)
    };
  }

  /**
   * Generate personalized challenges
   */
  generateChallenges(userId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const challenges = challengeService.generatePersonalizedChallenges(user);
    
    // Add challenges to user
    challenges.forEach(challenge => {
      user.addChallenge(challenge);
    });

    return challenges;
  }

  /**
   * Get active challenges
   */
  getActiveChallenges(userId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update progress for all active challenges
    user.activeChallenges.forEach(challenge => {
      challengeService.updateChallengeProgress(challenge, user);
    });

    return user.activeChallenges;
  }

  /**
   * Complete a challenge
   */
  completeChallenge(userId, challengeId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const challenge = user.activeChallenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if challenge is actually completed
    challengeService.updateChallengeProgress(challenge, user);
    
    if (!challenge.completed) {
      throw new Error('Challenge requirements not met');
    }

    const completedChallenge = user.completeChallenge(challengeId);
    
    // Award points and check achievements
    const pointsResult = gamificationService.awardPoints(user, 'completeChallenge');
    const newAchievements = gamificationService.checkAchievements(user);

    return { 
      challenge: completedChallenge, 
      pointsAwarded: pointsResult.points,
      leveledUp: pointsResult.leveledUp,
      newAchievements 
    };
  }

  /**
   * Get user gamification stats
   */
  getGamificationStats(userId) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const allUsers = this.getAllUsers();
    const ranking = gamificationService.calculateRank(user, allUsers);

    return {
      points: user.points,
      level: user.level,
      badges: user.badges,
      achievements: user.achievements,
      ranking,
      completedChallenges: user.completedChallenges.length,
      activeChallenges: user.activeChallenges.length
    };
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit = 10) {
    const allUsers = this.getAllUsers();
    return gamificationService.getLeaderboard(allUsers, limit);
  }

  /**
   * Share progress with friends
   */
  shareProgress(userId, friendIds) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.privacySettings.shareProgress) {
      throw new Error('Progress sharing is disabled');
    }

    const progressData = {
      name: user.name,
      level: user.level,
      points: user.points,
      recentAchievements: user.achievements.slice(-3),
      completedChallenges: user.completedChallenges.length
    };

    return progressData;
  }

  /**
   * Compare with friends
   */
  compareWithFriends(userId, friendIds) {
    const user = this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const comparisons = friendIds.map(friendId => {
      const friend = this.getUser(friendId);
      if (!friend || !friend.privacySettings.shareProgress) {
        return null;
      }

      return {
        name: friend.name,
        level: friend.level,
        points: friend.points,
        badges: friend.badges.length
      };
    }).filter(f => f !== null);

    return {
      user: {
        name: user.name,
        level: user.level,
        points: user.points,
        badges: user.badges.length
      },
      friends: comparisons
    };
  }
}

module.exports = new FinanceController();
