'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category { id: string; name: string }
interface Recurring { id: string; amount: number; description?: string; dayOfMonth: number; category?: Category }

export default function RecurringPage() {
  const [recs, setRecs] = useState<Recurring[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState('1');
  const [categoryId, setCategoryId] = useState<string | null>('');

  const load = () => {
    fetch('/api/recurring').then(r => r.json()).then(setRecs);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    await fetch('/api/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),
        description,
        dayOfMonth: parseInt(day),
        categoryId: categoryId || undefined,
        startDate: new Date().toISOString(),
      }),
    });
    setAmount('');
    setDescription('');
    load();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recurring Expenses</h1>
      <div className="space-y-2 mb-6 p-4 border rounded bg-white">
        <h2 className="font-semibold">Add Recurring Expense</h2>
        <div className="flex gap-2">
          <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <Input type="number" placeholder="Day of month" value={day} onChange={e => setDay(e.target.value)} />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={add} disabled={!amount}>Add</Button>
        </div>
      </div>
      <ul className="space-y-1">
        {recs.map(r => (
          <li key={r.id} className="p-2 border rounded bg-white flex justify-between">
            <span>{r.description || '—'} – Day {r.dayOfMonth}</span>
            <span className="font-semibold">${r.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
