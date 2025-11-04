# API Examples

This document provides detailed examples of how to use the API endpoints.

## Setup

All examples assume the API is running on `http://localhost:3000`. Replace `{userId}` with actual user IDs from your responses.

## 1. User Management

### Create a User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "points": 0,
    "level": 1,
    "badges": [],
    "achievements": []
  }
}
```

### Get User Details

```bash
curl http://localhost:3000/api/users/{userId}
```

## 2. Transaction Management

### Add a Transaction

```bash
curl -X POST http://localhost:3000/api/users/{userId}/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 75.50,
    "category": "groceries",
    "description": "Whole Foods shopping",
    "date": "2024-01-15"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "trans-123",
      "amount": 75.50,
      "category": "groceries",
      "description": "Whole Foods shopping"
    },
    "newAchievements": [
      {
        "name": "First Step",
        "description": "Added your first transaction",
        "icon": "🎯"
      }
    ]
  }
}
```

### Get All Transactions

```bash
curl http://localhost:3000/api/users/{userId}/transactions
```

## 3. Savings Goals

### Create a Savings Goal

```bash
curl -X POST http://localhost:3000/api/users/{userId}/savings-goals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Fund",
    "targetAmount": 5000,
    "deadline": "2024-12-31",
    "category": "emergency"
  }'
```

### Update Savings Goal Progress

```bash
curl -X PUT http://localhost:3000/api/users/{userId}/savings-goals/{goalId} \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500
  }'
```

## 4. Spending Analysis

### Get Spending Analysis

```bash
curl http://localhost:3000/api/users/{userId}/analysis
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categoryBreakdown": {
      "groceries": 450.00,
      "dining": 320.50,
      "transportation": 180.00
    },
    "totalSpending": 950.50,
    "averageDailySpending": 31.68,
    "trends": {
      "increasing": [
        {
          "category": "dining",
          "change": "15.30"
        }
      ],
      "decreasing": [],
      "stable": ["groceries"]
    },
    "insights": [
      "Total spending: $950.50",
      "Average daily spending: $31.68",
      "Top spending category: dining ($320.50)",
      "⚠️ dining spending increased by 15.30%"
    ],
    "anomalies": []
  }
}
```

## 5. Challenges

### Generate Personalized Challenges

```bash
curl -X POST http://localhost:3000/api/users/{userId}/challenges/generate
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "challenge-1",
      "title": "Save $300 this month",
      "description": "Put aside $300 towards your savings goal",
      "type": "savings",
      "target": 300,
      "current": 0,
      "reward": 100,
      "duration": 30
    },
    {
      "id": "challenge-2",
      "title": "Reduce dining spending",
      "description": "Cut your dining expenses by 15% (Save $48)",
      "type": "spending",
      "target": 272,
      "current": 0,
      "reward": 80,
      "duration": 30
    }
  ]
}
```

### Get Active Challenges

```bash
curl http://localhost:3000/api/users/{userId}/challenges
```

### Complete a Challenge

```bash
curl -X POST http://localhost:3000/api/users/{userId}/challenges/{challengeId}/complete
```

**Response:**
```json
{
  "success": true,
  "data": {
    "challenge": {
      "id": "challenge-1",
      "title": "Save $300 this month",
      "completed": true,
      "completedAt": "2024-01-30T10:00:00Z"
    },
    "pointsAwarded": 100,
    "leveledUp": false,
    "newAchievements": []
  }
}
```

## 6. Gamification Stats

### Get User Stats

```bash
curl http://localhost:3000/api/users/{userId}/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "points": 1250,
    "level": 2,
    "badges": [
      {
        "name": "First Step",
        "icon": "🎯",
        "rarity": "common"
      },
      {
        "name": "Budget Tracker",
        "icon": "📊",
        "rarity": "common"
      }
    ],
    "achievements": [
      {
        "name": "First Transaction",
        "rewardPoints": 20
      }
    ],
    "ranking": {
      "rank": 15,
      "totalUsers": 100,
      "percentile": "85.0"
    },
    "completedChallenges": 3,
    "activeChallenges": 2
  }
}
```

### Get Leaderboard

```bash
curl "http://localhost:3000/api/leaderboard?limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "name": "Alice Johnson",
      "level": 5,
      "points": 5200,
      "badges": 8
    },
    {
      "rank": 2,
      "name": "Bob Smith",
      "level": 4,
      "points": 4100,
      "badges": 6
    }
  ]
}
```

## 7. Social Features

### Share Progress

```bash
curl -X POST http://localhost:3000/api/users/{userId}/share \
  -H "Content-Type: application/json" \
  -d '{
    "friendIds": ["friend-id-1", "friend-id-2"]
  }'
```

### Compare with Friends

```bash
curl -X POST http://localhost:3000/api/users/{userId}/compare \
  -H "Content-Type: application/json" \
  -d '{
    "friendIds": ["friend-id-1", "friend-id-2"]
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Alice Johnson",
      "level": 5,
      "points": 5200,
      "badges": 8
    },
    "friends": [
      {
        "name": "Bob Smith",
        "level": 4,
        "points": 4100,
        "badges": 6
      }
    ]
  }
}
```

## Common Error Responses

### User Not Found
```json
{
  "success": false,
  "error": "User not found"
}
```

### Challenge Requirements Not Met
```json
{
  "success": false,
  "error": "Challenge requirements not met"
}
```

### Invalid Request
```json
{
  "success": false,
  "error": "Invalid request data"
}
```
