const { v4: uuidv4 } = require('uuid');

/**
 * Achievement Model
 * Represents a milestone achievement
 */
class Achievement {
  constructor(name, description, criteria, rewardPoints) {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.criteria = criteria; // Function or conditions to check
    this.rewardPoints = rewardPoints;
    this.unlockedAt = new Date();
  }
}

module.exports = Achievement;
