/**
 * SpendingAnalysisService
 * Analyzes user spending patterns and provides insights
 */
class SpendingAnalysisService {
  constructor() {
    this.categories = [
      'groceries', 'dining', 'transportation', 'utilities', 
      'entertainment', 'healthcare', 'shopping', 'education', 'other'
    ];
  }

  /**
   * Analyze spending by category
   */
  analyzeByCategory(transactions) {
    const categoryTotals = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'other';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += transaction.amount;
    });

    return categoryTotals;
  }

  /**
   * Calculate total spending for a time period
   */
  calculateTotalSpending(transactions, startDate, endDate) {
    return transactions
      .filter(t => {
        const transDate = new Date(t.date);
        return transDate >= startDate && transDate <= endDate;
      })
      .reduce((total, t) => total + t.amount, 0);
  }

  /**
   * Calculate average daily spending
   */
  calculateAverageDailySpending(transactions, days = 30) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const total = this.calculateTotalSpending(transactions, startDate, endDate);
    return total / days;
  }

  /**
   * Identify spending trends
   */
  identifyTrends(transactions) {
    const trends = {
      increasing: [],
      decreasing: [],
      stable: []
    };

    const categoryData = this.analyzeByCategory(transactions);
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    Object.keys(categoryData).forEach(category => {
      const recentSpending = this.calculateCategorySpending(
        transactions, category, lastMonth, now
      );
      const previousSpending = this.calculateCategorySpending(
        transactions, category, twoMonthsAgo, lastMonth
      );

      const change = previousSpending > 0 
        ? ((recentSpending - previousSpending) / previousSpending) * 100
        : 0;

      if (change > 10) {
        trends.increasing.push({ category, change: change.toFixed(2) });
      } else if (change < -10) {
        trends.decreasing.push({ category, change: change.toFixed(2) });
      } else {
        trends.stable.push(category);
      }
    });

    return trends;
  }

  /**
   * Calculate spending for a specific category in a date range
   */
  calculateCategorySpending(transactions, category, startDate, endDate) {
    return transactions
      .filter(t => {
        const transDate = new Date(t.date);
        return t.category === category && 
               transDate >= startDate && 
               transDate <= endDate;
      })
      .reduce((total, t) => total + t.amount, 0);
  }

  /**
   * Identify unusual spending patterns
   */
  identifyAnomalies(transactions) {
    const avgSpending = this.calculateAverageDailySpending(transactions);
    const anomalies = [];

    // Group by day
    const dailySpending = {};
    transactions.forEach(t => {
      const dateKey = new Date(t.date).toISOString().split('T')[0];
      if (!dailySpending[dateKey]) {
        dailySpending[dateKey] = 0;
      }
      dailySpending[dateKey] += t.amount;
    });

    // Find days with unusual spending (2x average or more)
    Object.entries(dailySpending).forEach(([date, amount]) => {
      if (amount > avgSpending * 2) {
        anomalies.push({ date, amount, avgSpending });
      }
    });

    return anomalies;
  }

  /**
   * Generate spending insights
   */
  generateInsights(user) {
    const transactions = user.transactions;
    const insights = [];

    if (transactions.length === 0) {
      return ['Start tracking your expenses to get personalized insights!'];
    }

    // Total spending insight
    const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
    insights.push(`Total spending: $${totalSpending.toFixed(2)}`);

    // Average daily spending
    const avgDaily = this.calculateAverageDailySpending(transactions);
    insights.push(`Average daily spending: $${avgDaily.toFixed(2)}`);

    // Category breakdown
    const categoryTotals = this.analyzeByCategory(transactions);
    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topCategory) {
      insights.push(`Top spending category: ${topCategory[0]} ($${topCategory[1].toFixed(2)})`);
    }

    // Trends
    const trends = this.identifyTrends(transactions);
    if (trends.increasing.length > 0) {
      const top = trends.increasing[0];
      insights.push(`⚠️ ${top.category} spending increased by ${top.change}%`);
    }

    return insights;
  }
}

module.exports = new SpendingAnalysisService();
