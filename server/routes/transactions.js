const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all transactions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, type, category } = req.query;
    
    let query = { userId: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (type) query.type = type;
    if (category) query.category = category;

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, category, amount, description, date, tags } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      type,
      category,
      amount,
      description,
      date: date || Date.now(),
      tags
    });

    await transaction.save();

    // Award points for logging transaction
    const user = await User.findById(req.userId);
    user.points += 5;
    await user.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get transaction analytics
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    // Calculate total income and expenses
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions.forEach(t => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { income: 0, expense: 0 };
      }
      categoryBreakdown[t.category][t.type] += t.amount;
    });

    // Monthly trends
    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      monthlyData[month][t.type] += t.amount;
    });

    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      categoryBreakdown,
      monthlyTrends: monthlyData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
