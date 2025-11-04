const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { POINTS } = require('../constants');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update savings goal
router.put('/savings-goal', authMiddleware, async (req, res) => {
  try {
    const { target, current, deadline, description } = req.body;

    const user = await User.findById(req.userId);
    user.savingsGoal = { target, current, deadline, description };
    await user.save();

    res.json(user.savingsGoal);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('username points level badges avatar')
      .sort({ points: -1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Award badge
router.post('/badge', authMiddleware, async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const user = await User.findById(req.userId);
    
    // Check if badge already exists
    const existingBadge = user.badges.find(b => b.name === name);
    if (existingBadge) {
      return res.status(400).json({ error: 'Badge already earned' });
    }

    user.badges.push({
      name,
      description,
      icon,
      earnedAt: new Date()
    });

    user.points += POINTS.BADGE_EARNED;
    await user.save();

    res.json(user.badges);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findById(req.userId);
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
