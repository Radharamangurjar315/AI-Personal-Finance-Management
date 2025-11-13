# Testing Guide

## Manual Testing Steps

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 2. Start the Application
```bash
npm start
```

The application will start on `http://localhost:5000`

### 3. Test User Registration
1. Open `http://localhost:5000` in your browser
2. Click "Register"
3. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Click "Register"
5. You should be redirected to the dashboard

### 4. Test Dashboard
- Verify user stats are displayed (Points: 0, Level: 1, Badges: 0, Active Challenges: 0)
- Verify analytics cards show $0.00 for income, expenses, and balance

### 5. Test Transaction Tracking
1. Click "Transactions" in the navigation
2. Fill in the Add Transaction form:
   - Type: Expense
   - Category: Food
   - Amount: 50.00
   - Description: Grocery shopping
3. Click "Add Transaction"
4. Verify the transaction appears in the list
5. Verify points increased by 5
6. Add another transaction:
   - Type: Income
   - Category: Salary
   - Amount: 2000.00
   - Description: Monthly salary
7. Verify both transactions are displayed
8. Go back to Dashboard and verify analytics are updated

### 6. Test Challenges
1. Click "Challenges" in the navigation
2. Click "Generate Personalized Challenges"
3. Verify 3 challenges are created:
   - Budget Master (reduce spending)
   - 30-Day Savings Challenge
   - Daily Tracker
4. Click "Update Progress" on any challenge
5. Enter a progress value
6. Verify progress bar updates
7. When progress reaches target, verify challenge status changes to "Completed"
8. Verify points are awarded

### 7. Test Leaderboard
1. Click "Leaderboard" in the navigation
2. Verify your user appears in the list
3. Verify points and level are displayed correctly

### 8. Test Logout
1. Click "Logout" in the navigation
2. Verify you're redirected to the login page

### 9. Test Login
1. Enter your credentials
2. Click "Login"
3. Verify you're redirected to the dashboard
4. Verify all your data is still there

## API Testing with curl

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Transactions (requires token)
```bash
TOKEN="your-token-here"
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

### Add Transaction (requires token)
```bash
TOKEN="your-token-here"
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","category":"Food","amount":50.00,"description":"Test expense"}'
```

### Get Analytics (requires token)
```bash
TOKEN="your-token-here"
curl http://localhost:5000/api/transactions/analytics \
  -H "Authorization: Bearer $TOKEN"
```

### Generate Challenges (requires token)
```bash
TOKEN="your-token-here"
curl -X POST http://localhost:5000/api/challenges/generate \
  -H "Authorization: Bearer $TOKEN"
```

### Get Leaderboard (requires token)
```bash
TOKEN="your-token-here"
curl http://localhost:5000/api/users/leaderboard \
  -H "Authorization: Bearer $TOKEN"
```

## Security Testing

### Test Rate Limiting
Try making more than 5 login attempts within 15 minutes:
```bash
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo "\nAttempt $i"
done
```

You should see "Too many login attempts" after 5 attempts.

### Test Input Sanitization
Try a malicious input:
```bash
TOKEN="your-token-here"
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"expense","category":"Food","amount":50.00,"description":{"$ne":null}}'
```

The mongo-sanitize middleware should strip the MongoDB operators.

## Expected Results

### Gamification
- ✅ Users earn 5 points for each transaction logged
- ✅ Users earn 100 points for each badge earned
- ✅ Users earn 50-150 points for completing challenges
- ✅ Users level up every 500 points
- ✅ Leaderboard shows top users by points

### Analytics
- ✅ Total income and expenses are calculated correctly
- ✅ Net balance shows income minus expenses
- ✅ Category breakdown shows spending by category
- ✅ Monthly trends track income/expense over time

### Challenges
- ✅ Personalized challenges are generated based on spending
- ✅ Progress can be tracked on each challenge
- ✅ Completed challenges award points
- ✅ Failed/expired challenges are marked accordingly

### Security
- ✅ Rate limiting prevents abuse
- ✅ Input sanitization prevents injection attacks
- ✅ JWT authentication protects endpoints
- ✅ Passwords are hashed with bcrypt
- ✅ User data is isolated by userId

## Known Limitations

1. **No automated tests**: The application relies on manual testing
2. **No email verification**: Users can register without verifying their email
3. **No password reset**: Users cannot reset their password if forgotten
4. **No bank integration**: Transactions must be entered manually
5. **No file uploads**: Avatar images use text initials only
6. **Local MongoDB**: Requires MongoDB to be running locally

## Future Improvements

1. Add automated unit and integration tests
2. Implement email verification and password reset
3. Add bank API integration (Plaid, Yodlee)
4. Implement email parsing for transaction detection
5. Add file upload for custom avatars
6. Deploy to production with cloud MongoDB
7. Add mobile responsive improvements
8. Implement real-time updates with WebSockets
9. Add export functionality (CSV, PDF)
10. Implement budget alerts and notifications
