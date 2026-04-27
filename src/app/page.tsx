'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 relative">
      <Button
        variant="outline"
        className="absolute top-4 right-4"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Personal Finance Manager
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Track expenses, analyze spending patterns, and manage your personal finances with ease.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a
            href="/expenses"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">Expenses</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Add, view, and manage your expenses. Track spending by category and payment method.
            </p>
          </a>

          <a
            href="/dashboard"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300">
              View analytics, charts, and spending insights with interactive visualizations.
            </p>
          </a>

          <a
            href="/upload"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">Upload Statement</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Upload credit-card statements (CSV/PDF) and automatically import transactions.
            </p>
          </a>

          <a
            href="/budget"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">Budgets</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Set monthly spending limits per category and track your progress.
            </p>
          </a>

          <a
            href="/recurring"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">Recurring Expenses</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage subscriptions, rent, and other recurring monthly expenses.
            </p>
          </a>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, Prisma, SQLite, and Recharts</p>
        </div>
      </div>
    </div>
  );
}
