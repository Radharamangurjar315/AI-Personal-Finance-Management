// Gamification constants
const POINTS = {
  TRANSACTION_LOG: 5,      // Points for logging a transaction
  BADGE_EARNED: 100,       // Points for earning a badge
  CHALLENGE_BASE: 50,      // Base points for challenges (can be overridden)
  LEVEL_THRESHOLD: 500     // Points needed per level
};

// Challenge types
const CHALLENGE_TYPES = {
  SAVINGS: 'savings',
  SPENDING: 'spending',
  INCOME: 'income',
  STREAK: 'streak'
};

// Challenge status
const CHALLENGE_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// Transaction types
const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Transaction sources
const TRANSACTION_SOURCES = {
  MANUAL: 'manual',
  BANK: 'bank',
  EMAIL: 'email'
};

module.exports = {
  POINTS,
  CHALLENGE_TYPES,
  CHALLENGE_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_SOURCES
};
