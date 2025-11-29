import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer, Transaction, Expense } from '../types';

const COMPANY_NAME = "My Personal Khata";

export const generateCustomerPDF = (customer: Customer, transactions: Transaction[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(COMPANY_NAME, 14, 20);
  
  doc.setFontSize(14);
  doc.text("Account Statement", 14, 30);
  
  // Customer Details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Name: ${customer.name}`, 14, 40);
  doc.text(`Mobile: ${customer.mobile}`, 14, 45);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 50);
  
  // Balance
  const balanceText = customer.balance >= 0 
    ? `They Owe You: ${Math.abs(customer.balance)}` 
    : `You Owe Them: ${Math.abs(customer.balance)}`;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Net Balance: ${balanceText}`, 14, 60);

  // Table
  const tableColumn = ["Date", "Description", "Type", "Amount"];
  const tableRows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.description,
    t.type === 'CREDIT' ? 'You Gave (Credit)' : 'You Got (Payment)',
    t.amount.toFixed(2)
  ]);

  autoTable(doc, {
    startY: 65,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // primary-500
    styles: { fontSize: 9 },
  });

  doc.save(`${customer.name.replace(/\s+/g, '_')}_Statement.pdf`);
};

export const generateAllPeoplePDF = (customers: Customer[]) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text(COMPANY_NAME, 14, 20);
  doc.setFontSize(14);
  doc.text("All People Balance Sheet", 14, 30);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

  const tableColumn = ["Name", "Mobile", "Status", "Balance"];
  const tableRows = customers.map(c => {
    let status = 'Settled';
    if (c.balance > 0) status = 'Owes You';
    if (c.balance < 0) status = 'You Owe';
    
    return [
      c.name,
      c.mobile,
      status,
      Math.abs(c.balance).toFixed(2)
    ];
  });

  // Calculate Totals
  const totalReceivable = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
  const totalPayable = customers.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);

  autoTable(doc, {
    startY: 45,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] }, // slate-800
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Total You Will Receive: ${totalReceivable.toFixed(2)}`, 14, finalY);
  doc.text(`Total You Have To Pay: ${totalPayable.toFixed(2)}`, 14, finalY + 6);

  doc.save(`All_People_Report.pdf`);
};

export const generateExpensesPDF = (expenses: Expense[]) => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text(COMPANY_NAME, 14, 20);
  doc.setFontSize(14);
  doc.text("Expense Report", 14, 30);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

  const tableColumn = ["Date", "Category", "Description", "Amount"];
  const tableRows = expenses.map(e => [
    new Date(e.date).toLocaleDateString(),
    e.category,
    e.description,
    e.amount.toFixed(2)
  ]);

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  autoTable(doc, {
    startY: 45,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] }, // Red for expense
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total Expenses: ${totalExpense.toFixed(2)}`, 14, finalY);

  doc.save(`Expense_Report.pdf`);
};