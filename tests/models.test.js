const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');
const Challenge = require('../src/models/Challenge');
const Badge = require('../src/models/Badge');

describe('User Model', () => {
  test('should create a new user', () => {
    const user = new User('John Doe', 'john@example.com');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.points).toBe(0);
    expect(user.level).toBe(1);
  });

  test('should add points and level up', () => {
    const user = new User('John Doe', 'john@example.com');
    user.awardPoints(500);
    expect(user.points).toBe(500);
    expect(user.level).toBe(1);
    
    user.awardPoints(600);
    expect(user.points).toBe(1100);
    expect(user.level).toBe(2);
  });

  test('should add transaction', () => {
    const user = new User('John Doe', 'john@example.com');
    const transaction = new Transaction(user.id, 50, 'groceries', 'Weekly shopping');
    user.addTransaction(transaction);
    expect(user.transactions.length).toBe(1);
  });

  test('should add badge', () => {
    const user = new User('John Doe', 'john@example.com');
    const badge = new Badge('First Step', 'Added first transaction', '🎯', 'common');
    user.addBadge(badge);
    expect(user.badges.length).toBe(1);
    expect(user.badges[0].name).toBe('First Step');
  });

  test('should not add duplicate badge', () => {
    const user = new User('John Doe', 'john@example.com');
    const badge = new Badge('First Step', 'Added first transaction', '🎯', 'common');
    user.addBadge(badge);
    user.addBadge(badge);
    expect(user.badges.length).toBe(1);
  });
});

describe('Transaction Model', () => {
  test('should create a transaction', () => {
    const transaction = new Transaction('user123', 100, 'dining', 'Restaurant');
    expect(transaction.amount).toBe(100);
    expect(transaction.category).toBe('dining');
    expect(transaction.description).toBe('Restaurant');
  });
});

describe('Challenge Model', () => {
  test('should create a challenge', () => {
    const challenge = new Challenge(
      'Save $500',
      'Save $500 this month',
      'savings',
      500,
      100,
      30
    );
    expect(challenge.title).toBe('Save $500');
    expect(challenge.target).toBe(500);
    expect(challenge.completed).toBe(false);
  });

  test('should update progress and complete', () => {
    const challenge = new Challenge(
      'Save $500',
      'Save $500 this month',
      'savings',
      500,
      100,
      30
    );
    
    challenge.updateProgress(300);
    expect(challenge.current).toBe(300);
    expect(challenge.completed).toBe(false);
    
    challenge.updateProgress(500);
    expect(challenge.current).toBe(500);
    expect(challenge.completed).toBe(true);
  });

  test('should calculate progress percentage', () => {
    const challenge = new Challenge(
      'Save $500',
      'Save $500 this month',
      'savings',
      500,
      100,
      30
    );
    
    challenge.updateProgress(250);
    expect(challenge.getProgressPercentage()).toBe(50);
  });
});
