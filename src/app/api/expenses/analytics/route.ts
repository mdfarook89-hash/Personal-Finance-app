import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const monthParam = url.searchParams.get('month'); // YYYY-MM
  const now = new Date();
  const year = monthParam ? parseInt(monthParam.split('-')[0]) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam.split('-')[1]) : now.getMonth() + 1;
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));

  // 1. Total spent
  const totalResult = await prisma.expense.aggregate({
    _sum: { amount: true },
    where: { date: { gte: start, lte: end } },
  });
  const totalSpent = totalResult._sum.amount ?? 0;

  // 2. Spending by category
  const byCategory = await prisma.expense.groupBy({
    by: ['categoryId'],
    _sum: { amount: true },
    where: { date: { gte: start, lte: end }, categoryId: { not: null } },
  });
  const catIds = byCategory.map(b => b.categoryId!).filter(Boolean);
  const categories = await prisma.category.findMany({
    where: { id: { in: catIds } },
  });
  const categoryBreakdown = byCategory.map((b: any) => {
    const cat = categories.find((c: any) => c.id === b.categoryId);
    return {
      category: cat?.name ?? 'Uncategorized',
      color: cat?.color ?? '#888888',
      amount: b._sum.amount ?? 0,
    } as any;
  });

  // 3. Daily spending (aggregate in JS)
  const dailyExpenses = await prisma.expense.findMany({
    where: { date: { gte: start, lte: end } },
    select: { date: true, amount: true },
  });
  const dailyMap: Record<string, number> = {};
  dailyExpenses.forEach(e => {
    const day = format(new Date(e.date), 'yyyy-MM-dd');
    dailyMap[day] = (dailyMap[day] || 0) + e.amount;
  });
  const dailySpending = Object.entries(dailyMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 4. Top category
  const topCategory = categoryBreakdown.sort((a, b) => b.amount - a.amount)[0]?.category ?? '—';

  // 5. Average daily spend
  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDaily = totalSpent / daysInMonth;

  return NextResponse.json({
    totalSpent,
    topCategory,
    avgDaily: parseFloat(avgDaily.toFixed(2)),
    categoryBreakdown,
    dailySpending,
  });
}
