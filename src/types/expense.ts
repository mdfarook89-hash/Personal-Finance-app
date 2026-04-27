export interface ExpenseInput {
  amount: number;
  description?: string;
  date?: string; // ISO date
  categoryId?: string;
  paymentMethod?: string;
}

export interface CategoryInput {
  name: string;
  color: string;
}
