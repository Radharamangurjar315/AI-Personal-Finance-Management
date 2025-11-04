# AI-Personal-Finance-Management

A real-time personal finance management web application with AI-powered insights, gamification, and social features.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Financial Tracking**: 
  - Track income and expenses with categories
  - Manual transaction entry with descriptions and tags
  - Real-time balance calculation and analytics
  
### AI & Analytics
- **Spending Analysis**: 
  - Category-wise breakdown of expenses
  - Monthly trends visualization
  - Income vs. expense comparison
- **Personalized Challenges**: 
  - AI-generated challenges based on spending patterns
  - Budget reduction goals
  - Savings targets
  - Daily tracking streaks

### Gamification System
- **Points & Rewards**: 
  - Earn points for logging transactions (+5 pts)
  - Complete challenges for bonus points (50-150 pts)
  - Earn badges for achievements (+100 pts)
- **Leveling System**: 
  - Progress through levels based on points
  - Level up every 500 points
- **Badges & Achievements**: 
  - Collect unique badges for milestones
  - Display badge collection on profile

### Social Features
- **Leaderboard**: 
  - Global rankings by points
  - See top performers
  - Compare your progress with others
- **User Profiles**: 
  - Customizable avatars
  - Public stats (points, level, badges)

### Savings Goals
- **Goal Setting**: 
  - Set target amounts and deadlines
  - Track progress toward goals
  - Visual progress indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Radharamangurjar315/AI-Personal-Finance-Management.git
cd AI-Personal-Finance-Management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

4. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

5. Start the application:
```bash
npm start
```

6. Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
.
├── server/
│   ├── models/           # Database models (User, Transaction, Challenge)
│   ├── routes/           # API routes (auth, transactions, users, challenges)
│   ├── middleware/       # Authentication middleware
│   └── index.js          # Express server setup
├── client/
│   └── public/
│       ├── index.html    # Main HTML file with styles
│       └── app.js        # Frontend JavaScript application
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🎮 How to Use

### 1. Register/Login
- Create a new account with username, email, and password
- Login to access your dashboard

### 2. Track Finances
- Add income and expense transactions
- Categorize transactions (Food, Salary, Entertainment, etc.)
- Add descriptions for better tracking
- View transaction history

### 3. Monitor Analytics
- View total income and expenses
- Check your net balance
- See category-wise breakdown
- Analyze monthly trends

### 4. Complete Challenges
- Generate personalized challenges based on your spending
- Update progress on active challenges
- Earn points for completing challenges
- Examples:
  - "Budget Master": Reduce spending by 10%
  - "30-Day Savings Challenge": Save $500
  - "Daily Tracker": Log transactions for 7 days

### 5. Earn Rewards
- Gain points for every transaction logged
- Complete challenges for bonus points
- Earn badges for achievements
- Level up as you earn more points

### 6. Compete on Leaderboard
- View global rankings
- See top performers
- Track your position
- Compare your progress

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing

### Frontend
- **Vanilla JavaScript**: No framework overhead
- **HTML5/CSS3**: Modern, responsive design
- **Fetch API**: HTTP requests

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API endpoints
- Secure session management

## 🎯 Future Enhancements

- [ ] Bank API integration for automatic transaction import
- [ ] Email parsing for transaction detection
- [ ] Bajaj Finance offers integration
- [ ] Credit score monitoring
- [ ] Budget recommendations
- [ ] Expense prediction using AI
- [ ] Mobile app version
- [ ] Social sharing features
- [ ] Friend connections
- [ ] Group challenges

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add transaction
- `GET /api/transactions/analytics` - Get analytics
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/savings-goal` - Update savings goal
- `GET /api/users/leaderboard` - Get leaderboard
- `POST /api/users/badge` - Award badge

### Challenges
- `GET /api/challenges` - Get all challenges
- `POST /api/challenges` - Create challenge
- `POST /api/challenges/generate` - Generate personalized challenges
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by gamification principles in personal finance
- Designed to make finance management fun and engaging
