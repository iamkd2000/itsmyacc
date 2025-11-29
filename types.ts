export interface Transaction {
  id: string;
  customerId: string;
  type: 'CREDIT' | 'PAYMENT'; // CREDIT = You Gave (They Owe You), PAYMENT = You Got (You Owe Them/Repayment)
  amount: number;
  date: string; // ISO String
  description: string;
  isEdited?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  balance: number; // Positive = They owe you. Negative = You owe them
  lastUpdated: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface User {
  mobile: string;
  isAuthenticated: boolean;
}