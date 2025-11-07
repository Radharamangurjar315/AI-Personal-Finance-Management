"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import TransactionList from "@/components/dashboard/TransactionList";
// import ChartPlaceholder from "@/components/dashboard/ChartPlaceholder";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ balance: 0, income: 0, expenses: 0, goals: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/transactions", { cache: "no-store", credentials: "include" });
if (!res.ok) {
  console.error("Fetch failed:", res.status);
  return;
}
const data = await res.json();

        if (res.ok && data.transactions) {
          setTransactions(data.transactions);

          // Calculate financial stats
          const income = data.transactions
            .filter((t: any) => t.type === "income")
            .reduce((acc: number, t: any) => acc + t.amount, 0);
          const expenses = data.transactions
            .filter((t: any) => t.type === "expense")
            .reduce((acc: number, t: any) => acc + t.amount, 0);
          const balance = income - expenses;

          setStats({ balance, income, expenses, goals: 3 });
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 text-white">
        <p className="text-xl">Loading your finance dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Balance" value={`₹${stats.balance}`} color="from-teal-400 to-green-400" />
          <StatCard title="Income" value={`₹${stats.income}`} color="from-blue-400 to-indigo-400" />
          <StatCard title="Expenses" value={`₹${stats.expenses}`} color="from-rose-400 to-pink-400" />
          <StatCard title="Goals Active" value={stats.goals} color="from-amber-400 to-yellow-400" />
        </section>

        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Savings Progress 🏆</h2>
          <ProgressBar progress={(stats.balance / (stats.income || 1)) * 100} />
          <p className="text-sm text-gray-200">
            You’ve completed {Math.round((stats.balance / (stats.income || 1)) * 100)}% of your savings goal.
          </p>
        </section>

        <section>
          <AnalyticsChart transactions={transactions} />
        </section>


        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <TransactionList transactions={transactions} />
        </section>
      </div>
    </main>
  );
}
