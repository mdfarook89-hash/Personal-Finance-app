'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Category } from '@prisma/client';

export default function ExpenseForm({ categories, onSaved }: { categories: Category[]; onSaved: () => void }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [categoryId, setCategoryId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),
        description,
        date: new Date(date).toISOString(),
        categoryId: categoryId || undefined,
        paymentMethod: paymentMethod || undefined,
      }),
    });
    setAmount('');
    setDescription('');
    setCategoryId('');
    setPaymentMethod('');
    setLoading(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <Select value={categoryId} onValueChange={(value: string) => setCategoryId(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <Input
        placeholder="Payment method"
        value={paymentMethod}
        onChange={e => setPaymentMethod(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Add Expense'}
      </Button>
    </form>
  );
}
