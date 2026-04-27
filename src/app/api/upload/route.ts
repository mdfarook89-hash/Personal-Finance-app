import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import csv from 'csv-parser';
import Tesseract from 'tesseract.js';

// Helper to parse CSV lines into expenses (expects headers: date,amount,description,category,paymentMethod)
async function parseCsv(filePath: string) {
  const results: any[] = [];
  const stream = (await fs.open(filePath, 'r')).createReadStream();
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Very naive PDF OCR -> split lines, look for pattern "MM/DD/YYYY $Amount Description"
async function parsePdf(filePath: string) {
  const { data: { text } } = await Tesseract.recognize(filePath, 'eng', { logger: () => {} });
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length);
  // Attempt to extract amount with regex
  const expenses: any[] = [];
  const amountRegex = /([0-9]{2}\/[0-9]{2}\/[0-9]{4})\s+\$?([0-9,.]+)/;
  for (const line of lines) {
    const match = line.match(amountRegex);
    if (match) {
      const [_, date, amount] = match;
      const description = line.replace(match[0], '').trim();
      expenses.push({ date, amount: parseFloat(amount.replace(/,/g, '')), description });
    }
  }
  return expenses;
}

export async function POST(request: Request) {
  // Need to parse multipart form – Next.js 13 app router provides request.formData()
  const form = await request.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase();
  const tmpPath = path.join(process.cwd(), 'tmp', `${Date.now()}_${file.name}`);
  await fs.mkdir(path.dirname(tmpPath), { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(tmpPath, buffer);

  let parsed: any[] = [];
  try {
    if (ext === '.csv') {
      parsed = await parseCsv(tmpPath) as any[];
    } else if (ext === '.pdf') {
      parsed = await parsePdf(tmpPath) as any[];
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Parsing failed', details: (e as any).message }, { status: 500 });
  } finally {
    // Clean up temporary file
    await fs.unlink(tmpPath).catch(() => {});
  }

  // Map parsed rows to expense create payloads (simple mapping)
  const created = [];
  for (const row of parsed) {
    const catName = row.category?.trim();
    let categoryId: string | undefined = undefined;
    if (catName) {
      const cat = await prisma.category.findUnique({ where: { name: catName } });
      if (cat) categoryId = cat.id;
    }
    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(row.amount),
        description: row.description ?? row.Description ?? undefined,
        date: row.date ? new Date(row.date) : new Date(),
        categoryId,
        paymentMethod: row.paymentMethod ?? undefined,
      },
    });
    created.push(expense);
  }

  return NextResponse.json({ imported: created.length, expenses: created });
}
