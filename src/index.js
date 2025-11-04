const express = require('express');
const financeController = require('./controllers/FinanceController');

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Personal Finance Management API',
    version: '1.0.0'
  });
});

// User endpoints
app.post('/api/users', (req, res) => {
  try {
    const { name, email } = req.body;
    const user = financeController.createUser(name, email);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:userId', (req, res) => {
  try {
    const user = financeController.getUser(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Transaction endpoints
app.post('/api/users/:userId/transactions', (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const result = financeController.addTransaction(
      req.params.userId, 
      amount, 
      category, 
      description, 
      date ? new Date(date) : new Date()
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:userId/transactions', (req, res) => {
  try {
    const transactions = financeController.getTransactions(req.params.userId);
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Savings goal endpoints
app.post('/api/users/:userId/savings-goals', (req, res) => {
  try {
    const { name, targetAmount, deadline, category } = req.body;
    const result = financeController.addSavingsGoal(
      req.params.userId,
      name,
      targetAmount,
      new Date(deadline),
      category
    );
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/users/:userId/savings-goals/:goalId', (req, res) => {
  try {
    const { amount } = req.body;
    const result = financeController.updateSavingsGoal(
      req.params.userId,
      req.params.goalId,
      amount
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Spending analysis endpoints
app.get('/api/users/:userId/analysis', (req, res) => {
  try {
    const analysis = financeController.getSpendingAnalysis(req.params.userId);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Challenge endpoints
app.post('/api/users/:userId/challenges/generate', (req, res) => {
  try {
    const challenges = financeController.generateChallenges(req.params.userId);
    res.json({ success: true, data: challenges });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:userId/challenges', (req, res) => {
  try {
    const challenges = financeController.getActiveChallenges(req.params.userId);
    res.json({ success: true, data: challenges });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/users/:userId/challenges/:challengeId/complete', (req, res) => {
  try {
    const result = financeController.completeChallenge(
      req.params.userId,
      req.params.challengeId
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Gamification endpoints
app.get('/api/users/:userId/stats', (req, res) => {
  try {
    const stats = financeController.getGamificationStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/leaderboard', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = financeController.getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Social endpoints
app.post('/api/users/:userId/share', (req, res) => {
  try {
    const { friendIds } = req.body;
    const progressData = financeController.shareProgress(req.params.userId, friendIds);
    res.json({ success: true, data: progressData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/users/:userId/compare', (req, res) => {
  try {
    const { friendIds } = req.body;
    const comparison = financeController.compareWithFriends(req.params.userId, friendIds);
    res.json({ success: true, data: comparison });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 AI Personal Finance Management API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/`);
  });
}

module.exports = app;
