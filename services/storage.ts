import { Customer, Transaction, Expense } from '../types';

const CUSTOMERS_KEY = 'dukaan_customers';
const TRANSACTIONS_KEY = 'dukaan_transactions';
const EXPENSES_KEY = 'dukaan_expenses';
const USER_KEY = 'dukaan_user';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock initial data
const initializeData = () => {
  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    const initialCustomers: Customer[] = [
      { id: '1', name: 'Ravi (Friend)', mobile: '9876543210', balance: 500, lastUpdated: new Date().toISOString() },
      { id: '2', name: 'Landlord', mobile: '9123456780', balance: -2000, lastUpdated: new Date().toISOString() },
      { id: '3', name: 'Sister', mobile: '8899776655', balance: 0, lastUpdated: new Date().toISOString() },
      // Added from PDF
      { id: 'raj_sonwane', name: 'Raj Sonwane', mobile: '7741031572', balance: 5750, lastUpdated: '2025-11-15T10:00:00.000Z' },
    ];
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(initialCustomers));
    
    const initialTransactions: Transaction[] = [
      { id: 't1', customerId: '1', type: 'CREDIT', amount: 500, date: new Date().toISOString(), description: 'Dinner Bill Split' },
      { id: 't2', customerId: '2', type: 'PAYMENT', amount: 2000, date: new Date().toISOString(), description: 'Rent Adjustment' },
      
      // Raj Sonwane Transactions
      { id: 'rs1', customerId: 'raj_sonwane', type: 'CREDIT', amount: 400, date: '2025-11-15T20:18:00.000Z', description: 'oct onv', isEdited: true },
      { id: 'rs2', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 2500, date: '2025-11-15T20:17:00.000Z', description: 'cash' },
      { id: 'rs3', customerId: 'raj_sonwane', type: 'CREDIT', amount: 1500, date: '2025-11-03T10:00:00.000Z', description: 'online' },
      { id: 'rs4', customerId: 'raj_sonwane', type: 'CREDIT', amount: 1000, date: '2025-11-03T09:00:00.000Z', description: 'online' },
      { id: 'rs5', customerId: 'raj_sonwane', type: 'CREDIT', amount: 350, date: '2025-11-03T08:30:00.000Z', description: 'mobile recharge' },
      { id: 'rs6', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 1500, date: '2025-11-03T08:00:00.000Z', description: 'cash' },
      { id: 'rs7', customerId: 'raj_sonwane', type: 'CREDIT', amount: 1500, date: '2025-10-28T14:00:00.000Z', description: 'online' },
      { id: 'rs8', customerId: 'raj_sonwane', type: 'CREDIT', amount: 5000, date: '2025-10-28T12:00:00.000Z', description: 'online' },
      { id: 'rs9', customerId: 'raj_sonwane', type: 'CREDIT', amount: 210, date: '2025-10-28T10:00:00.000Z', description: '' },
      { id: 'rs10', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 4000, date: '2025-10-09T16:00:00.000Z', description: 'cash vishal' },
      { id: 'rs11', customerId: 'raj_sonwane', type: 'CREDIT', amount: 3790, date: '2025-10-09T14:00:00.000Z', description: 'electricity bill payment' },
      { id: 'rs12', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 2030, date: '2025-10-02T18:00:00.000Z', description: 'online cash' },
      { id: 'rs13', customerId: 'raj_sonwane', type: 'CREDIT', amount: 300, date: '2025-10-02T16:00:00.000Z', description: 'ele bill' },
      { id: 'rs14', customerId: 'raj_sonwane', type: 'CREDIT', amount: 530, date: '2025-10-02T12:00:00.000Z', description: 'bag' },
      { id: 'rs15', customerId: 'raj_sonwane', type: 'CREDIT', amount: 400, date: '2025-09-22T10:00:00.000Z', description: 'September' },
      { id: 'rs16', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 350, date: '2025-08-19T14:00:00.000Z', description: 'online' },
      { id: 'rs17', customerId: 'raj_sonwane', type: 'CREDIT', amount: 350, date: '2025-08-19T10:00:00.000Z', description: 'recharge' },
      { id: 'rs18', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 1000, date: '2025-08-17T16:00:00.000Z', description: 'online' },
      { id: 'rs19', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 150, date: '2025-08-17T12:00:00.000Z', description: 'online' },
      { id: 'rs20', customerId: 'raj_sonwane', type: 'CREDIT', amount: 150, date: '2025-08-15T14:00:00.000Z', description: 'online' },
      { id: 'rs21', customerId: 'raj_sonwane', type: 'CREDIT', amount: 400, date: '2025-08-15T10:00:00.000Z', description: 'August' },
      { id: 'rs22', customerId: 'raj_sonwane', type: 'CREDIT', amount: 1000, date: '2025-07-31T18:00:00.000Z', description: 'online' },
      { id: 'rs23', customerId: 'raj_sonwane', type: 'CREDIT', amount: 400, date: '2025-07-31T10:00:00.000Z', description: 'july month' },
      { id: 'rs24', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 400, date: '2025-06-26T10:00:00.000Z', description: 'online' },
      { id: 'rs25', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 1000, date: '2025-06-23T10:00:00.000Z', description: 'cash' },
      { id: 'rs26', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 3000, date: '2025-06-22T10:00:00.000Z', description: 'online' },
      { id: 'rs27', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 9000, date: '2025-06-19T18:00:00.000Z', description: 'online' },
      { id: 'rs28', customerId: 'raj_sonwane', type: 'CREDIT', amount: 13000, date: '2025-06-19T16:00:00.000Z', description: 'online' },
      { id: 'rs29', customerId: 'raj_sonwane', type: 'CREDIT', amount: 400, date: '2025-06-19T14:00:00.000Z', description: 'may june' },
      { id: 'rs30', customerId: 'raj_sonwane', type: 'PAYMENT', amount: 750, date: '2025-06-19T10:00:00.000Z', description: '' },
      { id: 'rs31', customerId: 'raj_sonwane', type: 'CREDIT', amount: 400, date: '2025-05-22T10:00:00.000Z', description: '' },
      { id: 'rs32', customerId: 'raj_sonwane', type: 'CREDIT', amount: 350, date: '2025-04-29T10:00:00.000Z', description: '' },
    ];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(initialTransactions));

    const initialExpenses: Expense[] = [
      { id: 'e1', amount: 150, category: 'Food', description: 'Lunch', date: new Date().toISOString() },
      { id: 'e2', amount: 400, category: 'Travel', description: 'Uber', date: new Date(Date.now() - 86400000).toISOString() },
    ];
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(initialExpenses));
  }
};

initializeData();

// --- Customers (People) ---

export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCustomerById = (id: string): Customer | undefined => {
  return getCustomers().find(c => c.id === id);
};

export const saveCustomer = (customer: Omit<Customer, 'id' | 'balance' | 'lastUpdated'> & { id?: string }): Customer => {
  const customers = getCustomers();
  let newCustomer: Customer;

  if (customer.id) {
    // Edit
    const index = customers.findIndex(c => c.id === customer.id);
    if (index > -1) {
      customers[index] = { ...customers[index], ...customer, lastUpdated: new Date().toISOString() };
      newCustomer = customers[index];
    } else {
      throw new Error('Person not found');
    }
  } else {
    // Add
    newCustomer = {
      id: generateId(),
      name: customer.name,
      mobile: customer.mobile,
      balance: 0,
      lastUpdated: new Date().toISOString(),
    };
    customers.push(newCustomer);
  }
  
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  return newCustomer;
};

// --- Transactions (Ledger) ---

export const getTransactions = (customerId: string): Transaction[] => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  const all: Transaction[] = data ? JSON.parse(data) : [];
  return all.filter(t => t.customerId === customerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'isEdited'>): Transaction => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  const all: Transaction[] = data ? JSON.parse(data) : [];
  
  const newTx: Transaction = {
    ...transaction,
    id: generateId(),
    isEdited: false
  };
  
  all.push(newTx);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(all));

  // Update customer balance
  const customers = getCustomers();
  const customerIndex = customers.findIndex(c => c.id === transaction.customerId);
  if (customerIndex > -1) {
    const customer = customers[customerIndex];
    if (transaction.type === 'CREDIT') {
      customer.balance += transaction.amount; 
    } else {
      customer.balance -= transaction.amount; 
    }
    customer.lastUpdated = transaction.date;
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }

  return newTx;
};

export const updateTransaction = (updatedTx: Transaction): Transaction => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  const allTx: Transaction[] = data ? JSON.parse(data) : [];
  const index = allTx.findIndex(t => t.id === updatedTx.id);

  if (index === -1) throw new Error("Transaction not found");

  const oldTx = allTx[index];
  
  const finalTx = { ...updatedTx, isEdited: true };
  allTx[index] = finalTx;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTx));

  const customers = getCustomers();
  const custIndex = customers.findIndex(c => c.id === updatedTx.customerId);

  if (custIndex > -1) {
    const customer = customers[custIndex];
    if (oldTx.type === 'CREDIT') {
        customer.balance -= oldTx.amount;
    } else {
        customer.balance += oldTx.amount;
    }
    if (updatedTx.type === 'CREDIT') {
        customer.balance += updatedTx.amount;
    } else {
        customer.balance -= updatedTx.amount;
    }
    customer.lastUpdated = new Date().toISOString();
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }

  return finalTx;
};

// --- Expenses ---

export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(EXPENSES_KEY);
  const all: Expense[] = data ? JSON.parse(data) : [];
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
  const data = localStorage.getItem(EXPENSES_KEY);
  const all: Expense[] = data ? JSON.parse(data) : [];

  const newExpense: Expense = {
    ...expense,
    id: generateId(),
  };

  all.push(newExpense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
  return newExpense;
};

// --- Backup & Restore ---

export const exportBackupData = (): string => {
  const backup = {
    customers: JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]'),
    transactions: JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]'),
    expenses: JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]'),
    user: localStorage.getItem(USER_KEY),
    timestamp: new Date().toISOString(),
    app: 'MyPersonalKhata'
  };
  return JSON.stringify(backup, null, 2);
};

export const importBackupData = (jsonString: string): boolean => {
  try {
    const backup = JSON.parse(jsonString);
    if (backup.app !== 'MyPersonalKhata') {
      alert("Invalid backup file");
      return false;
    }
    
    if (backup.customers) localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(backup.customers));
    if (backup.transactions) localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(backup.transactions));
    if (backup.expenses) localStorage.setItem(EXPENSES_KEY, JSON.stringify(backup.expenses));
    if (backup.user) localStorage.setItem(USER_KEY, backup.user);
    
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};