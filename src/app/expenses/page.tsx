'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import VoiceExpense from '@/components/voice/VoiceExpense';
import ExpenseList from '@/components/expenses/ExpenseList';

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function ExpensesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(setCategories);
  }, []);

  const handleSaved = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <VoiceExpense />
      <ExpenseForm categories={categories} onSaved={handleSaved} />
      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Recent Expenses</h2>
      <ExpenseList refreshKey={refreshKey} />
    </div>
  );
}
