'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Expense } from '@prisma/client';

export default function ExpenseList({ refreshKey }: { refreshKey: number }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch('/api/expenses')
      .then(r => r.json())
      .then(setExpenses);
  }, [refreshKey]);

  const remove = async (id: string) => {
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  if (expenses.length === 0) return <p className="text-gray-500">No expenses yet.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Date</th>
          <th className="text-left p-2">Description</th>
          <th className="text-right p-2">Amount</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(e => (
          <tr key={e.id} className="border-b">
            <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
            <td className="p-2">{e.description ?? '—'}</td>
            <td className="p-2 text-right">${e.amount.toFixed(2)}</td>
            <td className="p-2">
              <Button variant="destructive" size="sm" onClick={() => remove(e.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
