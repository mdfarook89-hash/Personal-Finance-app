'use client';
import { useEffect, useState } from 'react';
import CategoryBreakdownChart from '@/components/dashboard/CategoryBreakdownChart';
import MonthlySpendingChart from '@/components/dashboard/MonthlySpendingChart';

interface Analytics {
  totalSpent: number;
  topCategory: string;
  avgDaily: number;
  categoryBreakdown: { category: string; amount: number; color: string }[];
  dailySpending: { date: string; amount: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/expenses/analytics')
      .then(r => r.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;
  if (!data) return <p className="p-6 text-red-600">Failed to load analytics.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Total Spent</h2>
          <p className="text-2xl font-semibold">${data.totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Top Category</h2>
          <p className="text-xl">{data.topCategory}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium">Avg Daily Spend</h2>
          <p className="text-xl">${data.avgDaily.toFixed(2)}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <CategoryBreakdownChart data={data.categoryBreakdown} />
        <MonthlySpendingChart data={data.dailySpending} />
      </div>
    </div>
  );
}
