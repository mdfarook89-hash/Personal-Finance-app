const { PrismaClient } = require('./src/generated/prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: 'Food', color: '#ff6384' },
      { name: 'Transport', color: '#36a2eb' },
      { name: 'Entertainment', color: '#ffce56' },
      { name: 'Utilities', color: '#4bc0c0' },
      { name: 'Shopping', color: '#9966ff' },
    ],
    skipDuplicates: true,
  });

  const cats = await prisma.category.findMany();
  const food = cats.find(c => c.name === 'Food')?.id;
  const transport = cats.find(c => c.name === 'Transport')?.id;
  const entertainment = cats.find(c => c.name === 'Entertainment')?.id;

  await prisma.expense.createMany({
    data: [
      { amount: 45.6, description: 'Groceries', date: new Date(), categoryId: food, paymentMethod: 'Credit Card' },
      { amount: 12.0, description: 'Bus ticket', date: new Date(), categoryId: transport, paymentMethod: 'Cash' },
      { amount: 30.0, description: 'Movie tickets', date: new Date(), categoryId: entertainment, paymentMethod: 'Credit Card' },
    ],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());
