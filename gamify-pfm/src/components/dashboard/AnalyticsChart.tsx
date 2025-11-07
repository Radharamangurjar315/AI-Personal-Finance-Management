"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  transactions: any[];
}

export default function AnalyticsChart({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-gray-300 text-center py-8">
        No transaction data available yet.
      </div>
    );
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expenses", value: expenses },
  ];

  const COLORS = ["#4ade80", "#f87171"];

  // Generate monthly data
  const monthlyData = Object.values(
    transactions.reduce((acc: any, t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" });
      if (!acc[month]) acc[month] = { month, income: 0, expenses: 0 };
      acc[month][t.type] += t.amount;
      return acc;
    }, {})
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-100">
      {/* Pie Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Monthly Spending Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="month" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
