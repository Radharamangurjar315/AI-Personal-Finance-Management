const Challenge = require('../models/Challenge');
const spendingAnalysisService = require('./SpendingAnalysisService');

/**
 * ChallengeService
 * Generates personalized challenges based on spending analysis
 */
class ChallengeService {
  constructor() {
    this.challengeTemplates = {
      savings: [
        { 
          title: 'Save ${amount} this month',
          description: 'Put aside ${amount} towards your savings goal',
          type: 'savings',
          reward: 100
        },
        {
          title: 'Emergency Fund Builder',
          description: 'Save ${amount} for your emergency fund',
          type: 'savings',
          reward: 150
        }
      ],
      spending: [
        {
          title: 'Reduce ${category} spending',
          description: 'Cut your ${category} expenses by ${percentage}%',
          type: 'spending',
          reward: 80
        },
        {
          title: 'Budget Master',
          description: 'Stay under $${amount} in total spending this week',
          type: 'spending',
          reward: 100
        },
        {
          title: 'No-Spend Challenge',
          description: 'Go ${days} days without spending on ${category}',
          type: 'spending',
          reward: 120
        }
      ],
      streak: [
        {
          title: 'Daily Tracker',
          description: 'Log expenses for ${days} consecutive days',
          type: 'streak',
          reward: 50
        },
        {
          title: 'Consistency King',
          description: 'Track your finances every day this month',
          type: 'streak',
          reward: 200
        }
      ],
      custom: [
        {
          title: 'Cook at Home',
          description: 'Eat home-cooked meals for ${days} days',
          type: 'custom',
          reward: 75
        },
        {
          title: 'Transportation Saver',
          description: 'Use public transport or bike instead of car for a week',
          type: 'custom',
          reward: 90
        }
      ]
    };
  }

  /**
   * Generate personalized challenges based on user data
   */
  generatePersonalizedChallenges(user) {
    const challenges = [];
    const transactions = user.transactions;
    
    if (transactions.length === 0) {
      // Beginner challenges
      challenges.push(this.createStreakChallenge(7, 50));
      challenges.push(this.createCustomChallenge('Start Your Journey', 
        'Add your first 5 transactions', 5, 30));
      return challenges;
    }

    // Analyze spending patterns
    const avgDaily = spendingAnalysisService.calculateAverageDailySpending(transactions);
    const categoryTotals = spendingAnalysisService.analyzeByCategory(transactions);
    const trends = spendingAnalysisService.identifyTrends(transactions);

    // Generate savings challenge
    const savingsTarget = Math.round(avgDaily * 30 * 0.2); // Save 20% of monthly spending
    challenges.push(this.createSavingsChallenge(savingsTarget));

    // Generate spending reduction challenge for top category
    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      challenges.push(this.createSpendingReductionChallenge(
        topCategory[0], 
        topCategory[1], 
        15 // 15% reduction
      ));
    }

    // If there's an increasing trend, create a challenge to control it
    if (trends.increasing.length > 0) {
      const category = trends.increasing[0].category;
      challenges.push(this.createSpendingReductionChallenge(
        category,
        categoryTotals[category],
        20 // 20% reduction for increasing categories
      ));
    }

    // Add a streak challenge
    challenges.push(this.createStreakChallenge(14, 100));

    // Add a custom lifestyle challenge
    if (categoryTotals.dining > 0) {
      challenges.push(this.createCustomChallenge(
        'Cook at Home',
        'Prepare home-cooked meals for 7 days',
        7,
        75
      ));
    }

    return challenges.slice(0, 3); // Return top 3 challenges
  }

  /**
   * Create a savings challenge
   */
  createSavingsChallenge(amount, duration = 30) {
    const template = this.challengeTemplates.savings[0];
    const challenge = new Challenge(
      template.title.replace('${amount}', amount),
      template.description.replace('${amount}', amount),
      template.type,
      amount,
      template.reward,
      duration
    );
    return challenge;
  }

  /**
   * Create a spending reduction challenge
   */
  createSpendingReductionChallenge(category, currentSpending, reductionPercentage) {
    const targetReduction = Math.round(currentSpending * (reductionPercentage / 100));
    const target = Math.round(currentSpending - targetReduction);
    
    const challenge = new Challenge(
      `Reduce ${category} spending`,
      `Cut your ${category} expenses by ${reductionPercentage}% (Save $${targetReduction})`,
      'spending',
      target,
      80,
      30
    );
    return challenge;
  }

  /**
   * Create a streak challenge
   */
  createStreakChallenge(days, reward) {
    const challenge = new Challenge(
      'Daily Tracker',
      `Log expenses for ${days} consecutive days`,
      'streak',
      days,
      reward,
      days + 7 // Extra days for flexibility
    );
    return challenge;
  }

  /**
   * Create a custom challenge
   */
  createCustomChallenge(title, description, target, reward) {
    const challenge = new Challenge(
      title,
      description,
      'custom',
      target,
      reward,
      30
    );
    return challenge;
  }

  /**
   * Update challenge progress
   */
  updateChallengeProgress(challenge, user) {
    const transactions = user.transactions;

    switch (challenge.type) {
      case 'savings':
        // Calculate savings (would need income data)
        const totalIncome = Array.isArray(user.income) 
          ? user.income.reduce((sum, i) => sum + i.amount, 0)
          : 0;
        const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
        const savings = totalIncome - totalSpending;
        challenge.updateProgress(savings);
        break;

      case 'spending':
        // Calculate spending in the challenge period
        const startDate = new Date(challenge.createdAt);
        const spendingInPeriod = spendingAnalysisService.calculateTotalSpending(
          transactions, startDate, new Date()
        );
        this.updateSpendingChallengeProgress(challenge, spendingInPeriod);
        break;

      case 'streak':
        // Calculate consecutive days
        const streak = this.calculateStreak(transactions);
        challenge.updateProgress(streak);
        break;

      default:
        // Custom challenges need manual update
        break;
    }

    return challenge;
  }

  /**
   * Update spending challenge progress
   * For spending challenges, lower is better - updates progress based on staying under target
   */
  updateSpendingChallengeProgress(challenge, spendingInPeriod) {
    if (spendingInPeriod <= challenge.target) {
      challenge.updateProgress(challenge.target);
    } else {
      challenge.updateProgress(challenge.target - (spendingInPeriod - challenge.target));
    }
  }

  /**
   * Calculate consecutive days streak
   */
  calculateStreak(transactions) {
    if (transactions.length === 0) return 0;

    const dates = transactions
      .map(t => new Date(t.date).toISOString().split('T')[0])
      .sort();
    
    const uniqueDates = [...new Set(dates)];
    let streak = 1;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return streak;
  }

  /**
   * Check if challenge is completed
   */
  checkChallengeCompletion(challenge, user) {
    this.updateChallengeProgress(challenge, user);
    return challenge.completed;
  }
}

module.exports = new ChallengeService();
