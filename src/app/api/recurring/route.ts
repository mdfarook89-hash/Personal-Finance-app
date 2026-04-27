import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

type RecurringInput = {
  amount: number;
  description?: string;
  dayOfMonth: number; // 1-31
  categoryId?: string;
  paymentMethod?: string;
  startDate: string; // ISO
  endDate?: string;
};

// GET all active recurring expenses
export async function GET() {
  const recs = await prisma.recurringExpense.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { startDate: 'desc' },
  });
  return NextResponse.json(recs);
}

// POST create a recurring expense
export async function POST(request: Request) {
  const data: RecurringInput = await request.json();
  const rec = await prisma.recurringExpense.create({
    data: {
      amount: data.amount,
      description: data.description,
      dayOfMonth: data.dayOfMonth,
      categoryId: data.categoryId,
      paymentMethod: data.paymentMethod,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
  return NextResponse.json(rec);
}
