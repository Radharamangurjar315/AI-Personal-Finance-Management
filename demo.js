/**
 * Demo Script
 * Demonstrates the gamification module functionality
 */

const financeController = require('./src/controllers/FinanceController');

console.log('🎮 AI Personal Finance Management - Demo\n');
console.log('=' .repeat(50));

// Create users
console.log('\n1️⃣  Creating users...');
const user1 = financeController.createUser('Alice Johnson', 'alice@example.com');
const user2 = financeController.createUser('Bob Smith', 'bob@example.com');
console.log(`✅ Created user: ${user1.name} (ID: ${user1.id})`);
console.log(`✅ Created user: ${user2.name} (ID: ${user2.id})`);

// Add transactions for Alice
console.log('\n2️⃣  Adding transactions for Alice...');
const categories = [
  { amount: 85, category: 'groceries', description: 'Weekly shopping' },
  { amount: 45, category: 'dining', description: 'Restaurant lunch' },
  { amount: 120, category: 'utilities', description: 'Electric bill' },
  { amount: 60, category: 'transportation', description: 'Gas' },
  { amount: 30, category: 'dining', description: 'Coffee shop' },
  { amount: 200, category: 'shopping', description: 'New shoes' },
  { amount: 75, category: 'groceries', description: 'Grocery store' },
  { amount: 50, category: 'entertainment', description: 'Movie tickets' }
];

categories.forEach((trans, i) => {
  const result = financeController.addTransaction(
    user1.id,
    trans.amount,
    trans.category,
    trans.description
  );
  console.log(`   ${i + 1}. ${trans.description}: $${trans.amount} (${trans.category})`);
  
  if (result.newAchievements && result.newAchievements.length > 0) {
    result.newAchievements.forEach(ach => {
      console.log(`   🏆 Achievement unlocked: ${ach.name} - ${ach.description}`);
    });
  }
});

// Get spending analysis
console.log('\n3️⃣  Analyzing spending patterns...');
const analysis = financeController.getSpendingAnalysis(user1.id);
console.log('\n   📊 Category Breakdown:');
Object.entries(analysis.categoryBreakdown).forEach(([cat, amount]) => {
  console.log(`      ${cat}: $${amount.toFixed(2)}`);
});
console.log(`\n   💰 Total Spending: $${analysis.totalSpending.toFixed(2)}`);
console.log(`   📈 Average Daily: $${analysis.averageDailySpending.toFixed(2)}`);

console.log('\n   💡 Insights:');
analysis.insights.forEach(insight => {
  console.log(`      • ${insight}`);
});

// Create savings goal
console.log('\n4️⃣  Creating savings goal...');
const goalResult = financeController.addSavingsGoal(
  user1.id,
  'Emergency Fund',
  5000,
  new Date('2024-12-31'),
  'emergency'
);
console.log(`   ✅ Goal created: ${goalResult.goal.name}`);
console.log(`   🎯 Target: $${goalResult.goal.targetAmount}`);

if (goalResult.newAchievements && goalResult.newAchievements.length > 0) {
  goalResult.newAchievements.forEach(ach => {
    console.log(`   🏆 Achievement unlocked: ${ach.name}`);
  });
}

// Generate personalized challenges
console.log('\n5️⃣  Generating personalized challenges...');
const challenges = financeController.generateChallenges(user1.id);
console.log(`   Generated ${challenges.length} challenges:\n`);
challenges.forEach((challenge, i) => {
  console.log(`   ${i + 1}. ${challenge.title}`);
  console.log(`      ${challenge.description}`);
  console.log(`      Type: ${challenge.type} | Reward: ${challenge.reward} points`);
  console.log(`      Progress: ${challenge.getProgressPercentage().toFixed(0)}%\n`);
});

// Get gamification stats
console.log('6️⃣  User gamification stats...');
const stats = financeController.getGamificationStats(user1.id);
console.log(`\n   👤 ${user1.name}`);
console.log(`   🎯 Level: ${stats.level}`);
console.log(`   ⭐ Points: ${stats.points}`);
console.log(`   🏅 Badges: ${stats.badges.length}`);
console.log(`   🏆 Achievements: ${stats.achievements.length}`);
console.log(`   ✅ Completed Challenges: ${stats.completedChallenges}`);
console.log(`   ⏳ Active Challenges: ${stats.activeChallenges}`);

if (stats.badges.length > 0) {
  console.log('\n   Earned Badges:');
  stats.badges.forEach(badge => {
    console.log(`      ${badge.icon} ${badge.name} (${badge.rarity})`);
  });
}

// Add some transactions for Bob
console.log('\n7️⃣  Adding transactions for Bob...');
for (let i = 0; i < 15; i++) {
  financeController.addTransaction(
    user2.id,
    Math.floor(Math.random() * 100) + 20,
    ['groceries', 'dining', 'shopping'][Math.floor(Math.random() * 3)],
    'Transaction ' + (i + 1)
  );
}
console.log('   ✅ Added 15 transactions for Bob');

// Get leaderboard
console.log('\n8️⃣  Leaderboard (Top 10):');
const leaderboard = financeController.getLeaderboard(10);
console.log('\n   Rank | Name              | Level | Points | Badges');
console.log('   ' + '-'.repeat(55));
leaderboard.forEach(entry => {
  const name = entry.name.padEnd(17);
  const level = String(entry.level).padStart(5);
  const points = String(entry.points).padStart(6);
  const badges = String(entry.badges).padStart(6);
  console.log(`   ${String(entry.rank).padStart(4)} | ${name} | ${level} | ${points} | ${badges}`);
});

// Social features
console.log('\n9️⃣  Social features - Comparing users...');
const comparison = financeController.compareWithFriends(user1.id, [user2.id]);
console.log('\n   Your Stats:');
console.log(`      Level: ${comparison.user.level} | Points: ${comparison.user.points}`);
console.log('\n   Friends:');
comparison.friends.forEach(friend => {
  console.log(`      ${friend.name}: Level ${friend.level} | Points: ${friend.points}`);
});

console.log('\n' + '='.repeat(50));
console.log('✨ Demo completed successfully!\n');
