'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category { id: string; name: string; color: string; createdAt: Date }
interface Budget { id: string; amount: number; month: number; year: number; category?: Category }

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState<string | null>((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(new Date().getFullYear());
  const [categoryId, setCategoryId] = useState('');

  const load = () => {
    fetch('/api/budget').then(r => r.json()).then(setBudgets);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), month: month ? parseInt(month) : new Date().getMonth() + 1, year, categoryId: categoryId || undefined }),
    });
    setAmount('');
    load();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>
      <div className="space-y-2 mb-6 p-4 border rounded bg-white">
        <h2 className="font-semibold">Set Budget</h2>
        <div className="flex gap-2">
          <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <Select value={month ?? ""} onValueChange={(v) => setMonth(v ?? "")}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Month" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i+1} value={(i+1).toString()}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value))} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category (optional)" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={save} disabled={!amount}>Add</Button>
        </div>
      </div>
      <h2 className="font-semibold mb-2">Existing Budgets</h2>
      <ul className="space-y-1">
        {budgets.map(b => (
          <li key={b.id} className="p-2 border rounded bg-white flex justify-between">
            <span>{b.category?.name ?? 'Overall'} – {b.month}/{b.year}</span>
            <span className="font-semibold">${b.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
