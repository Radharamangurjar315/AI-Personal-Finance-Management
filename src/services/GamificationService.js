const Badge = require('../models/Badge');
const Achievement = require('../models/Achievement');

/**
 * GamificationService
 * Manages points, badges, achievements, and levels
 */
class GamificationService {
  constructor() {
    this.pointsForActions = {
      addTransaction: 10,
      completeChallenge: 100,
      reachSavingsGoal: 200,
      weeklyStreak: 50,
      monthlyStreak: 150
    };

    this.badgeDefinitions = [
      { name: 'First Step', description: 'Added your first transaction', icon: '🎯', rarity: 'common' },
      { name: 'Budget Tracker', description: 'Tracked 10 transactions', icon: '📊', rarity: 'common' },
      { name: 'Savings Star', description: 'Reached your first savings goal', icon: '⭐', rarity: 'rare' },
      { name: 'Challenge Master', description: 'Completed 5 challenges', icon: '🏆', rarity: 'rare' },
      { name: 'Financial Guru', description: 'Reached level 10', icon: '🎓', rarity: 'epic' },
      { name: 'Penny Pincher', description: 'Saved $1000 in a month', icon: '💰', rarity: 'epic' },
      { name: 'Legend', description: 'Reached level 50', icon: '👑', rarity: 'legendary' }
    ];

    this.achievementDefinitions = [
      { name: 'Getting Started', description: 'Complete your profile', rewardPoints: 50 },
      { name: 'First Transaction', description: 'Add your first expense', rewardPoints: 20 },
      { name: 'Week Warrior', description: 'Track expenses for 7 consecutive days', rewardPoints: 100 },
      { name: 'Month Master', description: 'Track expenses for 30 consecutive days', rewardPoints: 300 },
      { name: 'Savings Savvy', description: 'Create your first savings goal', rewardPoints: 50 },
      { name: 'Goal Getter', description: 'Complete a savings goal', rewardPoints: 200 }
    ];
  }

  /**
   * Award points to a user
   */
  awardPoints(user, action) {
    const points = this.pointsForActions[action] || 0;
    const leveledUp = user.awardPoints(points);
    
    if (leveledUp) {
      this.checkLevelBadges(user);
    }

    return { points, leveledUp, newLevel: user.level };
  }

  /**
   * Check and award badges based on user level
   */
  checkLevelBadges(user) {
    if (user.level === 10) {
      this.awardBadge(user, 'Financial Guru');
    } else if (user.level === 50) {
      this.awardBadge(user, 'Legend');
    }
  }

  /**
   * Award a badge to a user
   */
  awardBadge(user, badgeName) {
    const badgeDefinition = this.badgeDefinitions.find(b => b.name === badgeName);
    if (badgeDefinition && !user.badges.find(b => b.name === badgeName)) {
      const badge = new Badge(
        badgeDefinition.name,
        badgeDefinition.description,
        badgeDefinition.icon,
        badgeDefinition.rarity
      );
      user.addBadge(badge);
      return badge;
    }
    return null;
  }

  /**
   * Check and award achievements
   */
  checkAchievements(user) {
    const newAchievements = [];

    // First transaction achievement
    if (user.transactions.length === 1) {
      const achievement = this.unlockAchievement(user, 'First Transaction');
      if (achievement) newAchievements.push(achievement);
    }

    // First savings goal achievement
    if (user.savingsGoals.length === 1) {
      const achievement = this.unlockAchievement(user, 'Savings Savvy');
      if (achievement) newAchievements.push(achievement);
    }

    // Completed savings goal achievement
    const completedGoals = user.savingsGoals.filter(g => g.completed);
    if (completedGoals.length >= 1) {
      const achievement = this.unlockAchievement(user, 'Goal Getter');
      if (achievement) newAchievements.push(achievement);
    }

    // Check badges
    if (user.transactions.length === 1) {
      const badge = this.awardBadge(user, 'First Step');
      if (badge) newAchievements.push(badge);
    }

    if (user.transactions.length === 10) {
      const badge = this.awardBadge(user, 'Budget Tracker');
      if (badge) newAchievements.push(badge);
    }

    if (completedGoals.length === 1) {
      const badge = this.awardBadge(user, 'Savings Star');
      if (badge) newAchievements.push(badge);
    }

    if (user.completedChallenges.length === 5) {
      const badge = this.awardBadge(user, 'Challenge Master');
      if (badge) newAchievements.push(badge);
    }

    return newAchievements;
  }

  /**
   * Unlock an achievement for a user
   */
  unlockAchievement(user, achievementName) {
    const achievementDef = this.achievementDefinitions.find(a => a.name === achievementName);
    if (achievementDef && !user.achievements.find(a => a.name === achievementName)) {
      const achievement = new Achievement(
        achievementDef.name,
        achievementDef.description,
        achievementDef.criteria,
        achievementDef.rewardPoints
      );
      user.addAchievement(achievement);
      user.awardPoints(achievementDef.rewardPoints);
      return achievement;
    }
    return null;
  }

  /**
   * Calculate user rank based on points
   */
  calculateRank(user, allUsers) {
    const sortedUsers = allUsers
      .filter(u => u.privacySettings && u.privacySettings.showOnLeaderboard)
      .sort((a, b) => b.points - a.points);
    
    const rank = sortedUsers.findIndex(u => u.id === user.id) + 1;
    return {
      rank,
      totalUsers: sortedUsers.length,
      percentile: ((1 - rank / sortedUsers.length) * 100).toFixed(1)
    };
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(allUsers, limit = 10) {
    return allUsers
      .filter(u => u.privacySettings && u.privacySettings.showOnLeaderboard)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        level: user.level,
        points: user.points,
        badges: user.badges.length
      }));
  }
}

module.exports = new GamificationService();
