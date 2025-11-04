# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  index.html │  │    app.js    │  │   CSS Styles     │  │
│  │  (UI/Layout)│  │  (Logic/API) │  │  (Presentation)  │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Express Server                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Middleware Layer                         │  │
│  │  • CORS         • Rate Limiting                       │  │
│  │  • Body Parser  • Input Sanitization                 │  │
│  │  • Auth Check   • Error Handling                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Route Handlers                       │  │
│  │  /api/auth        /api/transactions                   │  │
│  │  /api/users       /api/challenges                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  • Points Calculation  • Challenge Generation        │  │
│  │  • Analytics          • Level Progression            │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      MongoDB Database                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Users   │  │ Transactions │  │     Challenges       │ │
│  └──────────┘  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required, lowercase),
  password: String (hashed, required),
  points: Number (default: 0),
  level: Number (default: 1),
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: Date
  }],
  savingsGoal: {
    target: Number,
    current: Number,
    deadline: Date,
    description: String
  },
  avatar: String (default: 'default-avatar.png'),
  createdAt: Date (default: now)
}
```

### Transaction Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  type: String (enum: ['income', 'expense'], required),
  category: String (required),
  amount: Number (required),
  description: String,
  date: Date (default: now),
  tags: [String],
  source: String (enum: ['manual', 'bank', 'email'], default: 'manual')
}
```

### Challenge Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  title: String (required),
  description: String (required),
  type: String (enum: ['savings', 'spending', 'income', 'streak'], required),
  target: Number (required),
  current: Number (default: 0),
  points: Number (default: 50),
  status: String (enum: ['active', 'completed', 'failed'], default: 'active'),
  startDate: Date (default: now),
  endDate: Date (required),
  completedAt: Date
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- **POST /register** - Register new user
  - Body: `{ username, email, password }`
  - Returns: `{ token, user }`
  
- **POST /login** - Authenticate user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Transaction Routes (`/api/transactions`)
All require authentication (Bearer token)

- **GET /** - Get all user transactions
  - Query params: `startDate`, `endDate`, `type`, `category`
  - Returns: Array of transactions
  
- **POST /** - Create transaction
  - Body: `{ type, category, amount, description, tags }`
  - Awards 5 points
  - Returns: Created transaction
  
- **GET /analytics** - Get spending analytics
  - Returns: `{ totalIncome, totalExpenses, balance, categoryBreakdown, monthlyTrends }`
  
- **PUT /:id** - Update transaction
  - Body: `{ type, category, amount, description, tags }`
  - Returns: Updated transaction
  
- **DELETE /:id** - Delete transaction
  - Returns: Success message

### User Routes (`/api/users`)
All require authentication

- **GET /profile** - Get user profile
  - Returns: User object (without password)
  
- **PUT /profile** - Update profile
  - Body: `{ username, avatar }`
  - Returns: Updated user
  
- **PUT /savings-goal** - Update savings goal
  - Body: `{ target, current, deadline, description }`
  - Returns: Updated savings goal
  
- **GET /leaderboard** - Get top 50 users
  - Returns: Array of users sorted by points
  
- **POST /badge** - Award badge to user
  - Body: `{ name, description, icon }`
  - Awards 100 points
  - Returns: User's badges array

### Challenge Routes (`/api/challenges`)
All require authentication

- **GET /** - Get all user challenges
  - Returns: Array of challenges
  
- **POST /** - Create custom challenge
  - Body: `{ title, description, type, target, points, endDate }`
  - Returns: Created challenge
  
- **POST /generate** - Generate personalized challenges
  - Analyzes spending patterns
  - Creates 3 challenges automatically
  - Returns: Array of generated challenges
  
- **PUT /:id** - Update challenge progress
  - Body: `{ current, status }`
  - Awards points on completion
  - Handles level-up logic
  - Returns: Updated challenge
  
- **DELETE /:id** - Delete challenge
  - Returns: Success message

## Gamification System

### Points System
```
Transaction logged: +5 points
Badge earned: +100 points
Challenge completed: +50-150 points (varies)
```

### Level System
```
Level = floor(totalPoints / 500) + 1

Examples:
0-499 points = Level 1
500-999 points = Level 2
1000-1499 points = Level 3
```

### Badge System
Badges are awarded manually or automatically based on achievements:
- First Transaction
- 10 Transactions
- 100 Transactions
- First Challenge Completed
- Budget Master (reduce spending)
- Savings Champion (meet savings goal)

### Challenge Generation Algorithm
```javascript
1. Analyze user's transaction history
2. Calculate average monthly expenses
3. Generate challenges:
   a. Budget Master: Reduce spending by 10%
   b. Savings Challenge: Save specific amount in 30 days
   c. Streak Challenge: Log daily for 7 days
4. Set appropriate point rewards
5. Set deadlines (7-30 days)
```

## Security Features

### Authentication
- **JWT Tokens**: Stateless authentication
- **bcrypt**: Password hashing (10 rounds)
- **Token Expiry**: Configurable (default: 7 days)

### Rate Limiting
```javascript
API Routes: 100 requests per 15 minutes
Auth Routes: 5 requests per 15 minutes (login/register)
```

### Input Sanitization
- **express-mongo-sanitize**: Strips MongoDB operators from input
- **Field Whitelisting**: Only specified fields can be updated
- **Type Validation**: Mongoose schema validation

### Authorization
- **Middleware**: Verifies JWT on protected routes
- **User Isolation**: All queries filter by userId
- **Resource Ownership**: Users can only access their own data

## Frontend Architecture

### State Management
```javascript
state = {
  user: null,           // Current user object
  token: null,          // JWT token
  transactions: [],     // User's transactions
  challenges: [],       // User's challenges
  leaderboard: [],      // Top users
  analytics: null,      // Spending analytics
  currentView: 'login'  // Current page view
}
```

### View Rendering
1. **Authentication Views**: Login, Register
2. **Main Views**: Dashboard, Transactions, Challenges, Leaderboard
3. **Components**: User stats, transaction list, challenge cards, etc.

### API Communication
- **Fetch API**: Native browser API for HTTP requests
- **Error Handling**: Try-catch with user-friendly messages
- **Token Management**: Stored in localStorage

## Deployment Considerations

### Environment Variables
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance-app
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas or hosted MongoDB
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up logging (Winston, Morgan)
- [ ] Add monitoring (New Relic, DataDog)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Add health check endpoint
- [ ] Configure proper error handling
- [ ] Implement email notifications
- [ ] Add analytics tracking

### Scalability Considerations
1. **Database Indexing**: Add indexes on userId, date, type
2. **Caching**: Implement Redis for leaderboard and analytics
3. **Load Balancing**: Use Nginx or cloud load balancer
4. **Database Sharding**: Shard by userId for horizontal scaling
5. **CDN**: Serve static files from CDN
6. **Microservices**: Split into auth, transactions, gamification services

## Technology Stack Summary

**Backend:**
- Node.js (Runtime)
- Express 5.x (Web Framework)
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- bcryptjs (Password Hashing)
- express-rate-limit (Rate Limiting)
- express-mongo-sanitize (Input Sanitization)

**Frontend:**
- Vanilla JavaScript (No framework)
- HTML5 (Structure)
- CSS3 (Styling)
- Fetch API (HTTP Client)

**Development:**
- npm (Package Manager)
- Git (Version Control)
- dotenv (Environment Variables)

## Performance Considerations

### Database Queries
- Use indexes on frequently queried fields
- Limit query results (pagination)
- Use projections to select only needed fields
- Aggregate analytics data efficiently

### Frontend Optimization
- Minimize DOM manipulations
- Lazy load components
- Cache static assets
- Debounce user inputs
- Use local storage wisely

### API Optimization
- Implement response compression
- Use HTTP caching headers
- Minimize payload size
- Batch related API calls
- Implement pagination for large datasets
