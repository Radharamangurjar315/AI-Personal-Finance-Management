const express = require('express');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');
const { POINTS } = require('../constants');

const router = express.Router();

// Get all challenges for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find({ userId: req.userId }).sort({ startDate: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create challenge
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, type, target, points, endDate } = req.body;

    const challenge = new Challenge({
      userId: req.userId,
      title,
      description,
      type,
      target,
      points: points || 50,
      endDate
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate personalized challenges
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    const user = await User.findById(req.userId);

    const generatedChallenges = [];

    // Calculate average monthly expenses
    const monthlyExpenses = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + t.amount;
    });

    const monthCount = Object.keys(monthlyExpenses).length;
    const avgExpense = monthCount > 0 
      ? Object.values(monthlyExpenses).reduce((a, b) => a + b, 0) / monthCount
      : 0;

    // Challenge 1: Reduce spending by 10% (only if user has expense history)
    if (avgExpense > 0) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      generatedChallenges.push({
        userId: req.userId,
        title: 'Budget Master',
        description: `Reduce your monthly spending by 10% (target: $${(avgExpense * 0.9).toFixed(2)})`,
        type: 'spending',
        target: avgExpense * 0.9,
        points: 100,
        endDate
      });
    }

    // Challenge 2: Save a specific amount
    const savingsChallenge = {
      userId: req.userId,
      title: '30-Day Savings Challenge',
      description: 'Save $500 in the next 30 days',
      type: 'savings',
      target: 500,
      points: 150,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
    generatedChallenges.push(savingsChallenge);

    // Challenge 3: Track daily
    const streakChallenge = {
      userId: req.userId,
      title: 'Daily Tracker',
      description: 'Log at least one transaction every day for 7 days',
      type: 'streak',
      target: 7,
      points: 75,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    generatedChallenges.push(streakChallenge);

    // Save challenges
    const saved = await Challenge.insertMany(generatedChallenges);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update challenge progress
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { current, status } = req.body;

    const challenge = await Challenge.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (current !== undefined) challenge.current = current;
    if (status) challenge.status = status;

    // Check if challenge is completed
    if (challenge.current >= challenge.target && challenge.status === 'active') {
      challenge.status = 'completed';
      challenge.completedAt = new Date();

      // Award points to user
      const user = await User.findById(req.userId);
      user.points += challenge.points;
      
      // Level up logic
      const newLevel = Math.floor(user.points / POINTS.LEVEL_THRESHOLD) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }

      await user.save();
    }

    await challenge.save();
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete challenge
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
