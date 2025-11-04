const spendingAnalysisService = require('../src/services/SpendingAnalysisService');
const gamificationService = require('../src/services/GamificationService');
const challengeService = require('../src/services/ChallengeService');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');

describe('SpendingAnalysisService', () => {
  test('should analyze spending by category', () => {
    const user = new User('John', 'john@example.com');
    user.addTransaction(new Transaction(user.id, 100, 'groceries', 'Food'));
    user.addTransaction(new Transaction(user.id, 50, 'groceries', 'Snacks'));
    user.addTransaction(new Transaction(user.id, 75, 'dining', 'Restaurant'));

    const analysis = spendingAnalysisService.analyzeByCategory(user.transactions);
    expect(analysis.groceries).toBe(150);
    expect(analysis.dining).toBe(75);
  });

  test('should calculate average daily spending', () => {
    const user = new User('John', 'john@example.com');
    user.addTransaction(new Transaction(user.id, 100, 'groceries', 'Food'));
    user.addTransaction(new Transaction(user.id, 200, 'dining', 'Restaurant'));

    const avg = spendingAnalysisService.calculateAverageDailySpending(user.transactions, 30);
    expect(avg).toBe(10); // 300 / 30 = 10
  });

  test('should generate insights', () => {
    const user = new User('John', 'john@example.com');
    user.addTransaction(new Transaction(user.id, 100, 'groceries', 'Food'));

    const insights = spendingAnalysisService.generateInsights(user);
    expect(insights.length).toBeGreaterThan(0);
    expect(insights[0]).toContain('Total spending');
  });
});

describe('GamificationService', () => {
  test('should award points for actions', () => {
    const user = new User('John', 'john@example.com');
    const result = gamificationService.awardPoints(user, 'addTransaction');
    
    expect(result.points).toBe(10);
    expect(user.points).toBe(10);
  });

  test('should award badge', () => {
    const user = new User('John', 'john@example.com');
    const badge = gamificationService.awardBadge(user, 'First Step');
    
    expect(badge).not.toBeNull();
    expect(user.badges.length).toBe(1);
    expect(user.badges[0].name).toBe('First Step');
  });

  test('should not award duplicate badge', () => {
    const user = new User('John', 'john@example.com');
    gamificationService.awardBadge(user, 'First Step');
    const secondBadge = gamificationService.awardBadge(user, 'First Step');
    
    expect(secondBadge).toBeNull();
    expect(user.badges.length).toBe(1);
  });

  test('should check achievements', () => {
    const user = new User('John', 'john@example.com');
    user.addTransaction(new Transaction(user.id, 100, 'groceries', 'Food'));
    
    const achievements = gamificationService.checkAchievements(user);
    expect(achievements.length).toBeGreaterThan(0);
  });

  test('should generate leaderboard', () => {
    const user1 = new User('John', 'john@example.com');
    const user2 = new User('Jane', 'jane@example.com');
    
    user1.awardPoints(500);
    user2.awardPoints(1000);
    
    const leaderboard = gamificationService.getLeaderboard([user1, user2], 10);
    
    expect(leaderboard.length).toBe(2);
    expect(leaderboard[0].name).toBe('Jane');
    expect(leaderboard[0].points).toBe(1000);
    expect(leaderboard[1].name).toBe('John');
  });
});

describe('ChallengeService', () => {
  test('should generate personalized challenges', () => {
    const user = new User('John', 'john@example.com');
    user.addTransaction(new Transaction(user.id, 100, 'groceries', 'Food'));
    user.addTransaction(new Transaction(user.id, 50, 'dining', 'Restaurant'));

    const challenges = challengeService.generatePersonalizedChallenges(user);
    expect(challenges.length).toBeGreaterThan(0);
    expect(challenges[0]).toHaveProperty('title');
    expect(challenges[0]).toHaveProperty('type');
  });

  test('should generate beginner challenges for new users', () => {
    const user = new User('John', 'john@example.com');
    const challenges = challengeService.generatePersonalizedChallenges(user);
    
    expect(challenges.length).toBeGreaterThan(0);
    expect(challenges.some(c => c.type === 'streak')).toBe(true);
  });

  test('should create savings challenge', () => {
    const challenge = challengeService.createSavingsChallenge(500, 30);
    
    expect(challenge.type).toBe('savings');
    expect(challenge.target).toBe(500);
    expect(challenge.duration).toBe(30);
  });

  test('should calculate streak', () => {
    const user = new User('John', 'john@example.com');
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    user.addTransaction(new Transaction(user.id, 100, 'groceries', 'Food', twoDaysAgo));
    user.addTransaction(new Transaction(user.id, 50, 'dining', 'Restaurant', yesterday));
    user.addTransaction(new Transaction(user.id, 75, 'shopping', 'Clothes', today));
    
    const streak = challengeService.calculateStreak(user.transactions);
    expect(streak).toBe(3);
  });
});
