# AI Personal Finance Management with Gamification 🎮💰

An intelligent personal finance management system that combines financial tracking with gamification elements to make budgeting engaging and rewarding.

## Features 🌟

### Financial Tracking
- **Transaction Management**: Track expenses manually or through integrated sources
- **Income Tracking**: Monitor income streams
- **Savings Goals**: Set and track progress towards financial goals
- **Category-based Organization**: Organize expenses by categories (groceries, dining, transportation, etc.)

### AI-Powered Analysis 🤖
- **Spending Analysis**: Analyze spending patterns by category and time period
- **Trend Detection**: Identify increasing, decreasing, or stable spending trends
- **Anomaly Detection**: Spot unusual spending patterns
- **Personalized Insights**: Get AI-generated insights based on your financial habits
- **Average Calculations**: Track daily, weekly, and monthly spending averages

### Gamification System 🎯
- **Points & Levels**: Earn points for financial activities and level up
- **Badges**: Unlock achievement badges for milestones
  - 🎯 First Step: Add your first transaction
  - 📊 Budget Tracker: Track 10 transactions
  - ⭐ Savings Star: Reach your first savings goal
  - 🏆 Challenge Master: Complete 5 challenges
  - 🎓 Financial Guru: Reach level 10
  - 💰 Penny Pincher: Save $1000 in a month
  - 👑 Legend: Reach level 50
- **Achievements**: Complete specific milestones for rewards
- **Levels**: Progress through levels based on accumulated points

### Personalized Challenges 💪
The system analyzes your spending habits and generates personalized challenges:

- **Savings Challenges**: Save specific amounts based on your income
- **Spending Reduction**: Cut spending in specific categories
- **Streak Challenges**: Log expenses consistently
- **Custom Lifestyle**: Behavioral challenges like cooking at home

### Social Features 👥
- **Leaderboard**: Compare your progress with other users
- **Friend Comparison**: Compare stats with friends
- **Progress Sharing**: Share achievements and milestones
- **Privacy Settings**: Control what information is shared

## Installation 📦

```bash
# Clone the repository
git clone https://github.com/Radharamangurjar315/AI-Personal-Finance-Management.git

# Navigate to the directory
cd AI-Personal-Finance-Management

# Install dependencies
npm install

# Start the server
npm start
```

## Usage 🚀

### Starting the API Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The API will be available at `http://localhost:3000`

### API Endpoints

#### Users
- `POST /api/users` - Create a new user
- `GET /api/users/:userId` - Get user details

#### Transactions
- `POST /api/users/:userId/transactions` - Add a transaction
- `GET /api/users/:userId/transactions` - Get all transactions

#### Savings Goals
- `POST /api/users/:userId/savings-goals` - Create a savings goal
- `PUT /api/users/:userId/savings-goals/:goalId` - Update savings goal progress

#### Analysis
- `GET /api/users/:userId/analysis` - Get spending analysis and insights

#### Challenges
- `POST /api/users/:userId/challenges/generate` - Generate personalized challenges
- `GET /api/users/:userId/challenges` - Get active challenges
- `POST /api/users/:userId/challenges/:challengeId/complete` - Complete a challenge

#### Gamification
- `GET /api/users/:userId/stats` - Get gamification stats (points, level, badges)
- `GET /api/leaderboard` - Get global leaderboard

#### Social
- `POST /api/users/:userId/share` - Share progress with friends
- `POST /api/users/:userId/compare` - Compare with friends

## Example Usage 📝

### 1. Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### 2. Add Transactions

```bash
curl -X POST http://localhost:3000/api/users/{userId}/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "category": "groceries",
    "description": "Weekly shopping"
  }'
```

### 3. Generate Challenges

```bash
curl -X POST http://localhost:3000/api/users/{userId}/challenges/generate
```

### 4. Get Spending Analysis

```bash
curl http://localhost:3000/api/users/{userId}/analysis
```

### 5. View Leaderboard

```bash
curl http://localhost:3000/api/leaderboard?limit=10
```

## Testing 🧪

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Architecture 🏗️

```
src/
├── models/          # Data models (User, Transaction, Challenge, Badge, etc.)
├── services/        # Business logic services
│   ├── SpendingAnalysisService.js    # Spending analysis & insights
│   ├── GamificationService.js        # Points, badges, achievements
│   └── ChallengeService.js           # Challenge generation & tracking
├── controllers/     # Request handlers
│   └── FinanceController.js          # Main finance operations
└── index.js         # Express API server
```

## Data Models 📊

### User
- Basic info (name, email)
- Financial data (transactions, income, savings goals)
- Gamification data (points, level, badges, achievements)
- Social features (friends, privacy settings)

### Transaction
- Amount, category, description, date
- Linked to user

### Challenge
- Title, description, type (savings/spending/streak/custom)
- Target, current progress, reward
- Duration and expiration

### Badge & Achievement
- Name, description, icon/reward
- Rarity levels (common, rare, epic, legendary)

## Gamification Points System 🎮

| Action | Points |
|--------|--------|
| Add Transaction | 10 |
| Complete Challenge | 100 |
| Reach Savings Goal | 200 |
| Weekly Streak | 50 |
| Monthly Streak | 150 |

**Level Calculation**: Level = ⌊Points / 1000⌋ + 1

## Future Enhancements 🔮

- Database integration (PostgreSQL/MongoDB)
- Bank API integrations (Plaid, Yodlee)
- Email parsing for automated transaction tracking
- Mobile app (React Native)
- Machine learning for better spending predictions
- Budget recommendations
- Bill reminders
- Financial health score
- Export reports (PDF, CSV)

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact 📧

For questions or support, please open an issue on GitHub.