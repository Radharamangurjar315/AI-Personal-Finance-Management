const { v4: uuidv4 } = require('uuid');

/**
 * Badge Model
 * Represents an achievement badge
 */
class Badge {
  constructor(name, description, icon, rarity = 'common') {
    this.id = uuidv4();
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.rarity = rarity; // 'common', 'rare', 'epic', 'legendary'
    this.earnedAt = new Date();
  }
}

module.exports = Badge;
