import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { ExpenseInput } from '@/types/expense';

// GET - list expenses (supports optional query params)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { categoryId, startDate, endDate } = Object.fromEntries(url.searchParams.entries());

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { category: true },
  });
  return NextResponse.json(expenses);
}

// POST - create a new expense
export async function POST(request: Request) {
  const body: ExpenseInput = await request.json();
  const expense = await prisma.expense.create({
    data: {
      amount: body.amount,
      description: body.description,
      date: body.date ? new Date(body.date) : undefined,
      categoryId: body.categoryId,
      paymentMethod: body.paymentMethod,
    },
    include: { category: true },
  });
  return NextResponse.json(expense);
}

// PUT - update an expense (id in query string)
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const body: Partial<ExpenseInput> = await request.json();
  const expense = await prisma.expense.update({
    where: { id },
    data: {
      amount: body.amount,
      description: body.description,
      date: body.date ? new Date(body.date) : undefined,
      categoryId: body.categoryId,
      paymentMethod: body.paymentMethod,
    },
    include: { category: true },
  });
  return NextResponse.json(expense);
}

// DELETE - remove an expense (id in query string)
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.expense.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
