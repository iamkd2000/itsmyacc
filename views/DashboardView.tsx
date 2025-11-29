import React, { useState, useEffect } from 'react';
import { Customer, Expense } from '../types';
import { getCustomers, saveCustomer, getExpenses, addExpense, exportBackupData, importBackupData } from '../services/storage';
import { generateAllPeoplePDF, generateExpensesPDF } from '../services/pdfGenerator';
import { 
  Search, 
  ArrowRight, 
  Wallet, 
  Users, 
  Banknote, 
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Heart,
  Film,
  MoreHorizontal,
  Download,
  Settings,
  Upload,
  Cloud
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface DashboardViewProps {
  onSelectCustomer: (customerId: string) => void;
  onLogout: () => void;
}

type Tab = 'PEOPLE' | 'EXPENSES';

const EXPENSE_CATEGORIES = [
  { id: 'Food', label: 'Food', icon: Utensils, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { id: 'Travel', label: 'Travel', icon: Car, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { id: 'Bills', label: 'Bills', icon: Zap, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { id: 'Health', label: 'Health', icon: Heart, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  { id: 'Entertainment', label: 'Ent.', icon: Film, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'Other', label: 'Other', icon: MoreHorizontal, color: 'bg-slate-700/30 text-slate-400 border-slate-600/30' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectCustomer, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('PEOPLE');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // New Person Form
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerMobile, setNewCustomerMobile] = useState('');

  // New Expense Form
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = () => {
    setCustomers(getCustomers());
    setExpenses(getExpenses());
  };

  const handleDownloadReport = () => {
    if (activeTab === 'PEOPLE') {
      generateAllPeoplePDF(customers);
    } else {
      generateExpensesPDF(expenses);
    }
  };

  const handleBackup = () => {
    const data = exportBackupData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_khata_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importBackupData(content)) {
          alert("Data restored successfully!");
          window.location.reload();
        } else {
          alert("Failed to restore data. Invalid file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomerName && newCustomerMobile) {
      saveCustomer({ name: newCustomerName, mobile: newCustomerMobile });
      loadData();
      setShowAddModal(false);
      setNewCustomerName('');
      setNewCustomerMobile('');
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseAmount) {
      addExpense({
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        description: expenseDesc || expenseCategory,
        date: new Date(expenseDate).toISOString()
      });
      loadData();
      setShowExpenseModal(false);
      setExpenseAmount('');
      setExpenseDesc('');
      setExpenseDate(new Date().toISOString().split('T')[0]);
      setExpenseCategory('Food');
    }
  };

  // People Logic
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.mobile.includes(searchTerm)
  );
  const totalReceivable = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);
  const totalPayable = customers.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const getCategoryConfig = (id: string) => {
    return EXPENSE_CATEGORIES.find(c => c.id === id) || EXPENSE_CATEGORIES[6];
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-lg sticky top-0 z-10">
        <div className="p-4 flex justify-between items-center max-w-3xl mx-auto w-full">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">My Personal Khata</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownloadReport} 
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Download PDF Report"
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)} 
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Settings & Backup"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button onClick={onLogout} className="text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg border border-slate-700 transition">
              Logout
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex max-w-3xl mx-auto w-full px-4 space-x-4 mt-2">
          <button 
            onClick={() => setActiveTab('PEOPLE')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center space-x-2 transition-all ${activeTab === 'PEOPLE' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Users className="h-4 w-4" />
            <span>People (Lending)</span>
          </button>
          <button 
            onClick={() => setActiveTab('EXPENSES')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center space-x-2 transition-all ${activeTab === 'EXPENSES' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Banknote className="h-4 w-4" />
            <span>My Expenses</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full p-4 pb-24">
        {activeTab === 'PEOPLE' && (
          <div className="space-y-4">
             {/* Summary Cards */}
             <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm text-center">
                 <p className="text-xs text-red-400 font-medium uppercase tracking-wider mb-1">Owes Me</p>
                 <p className="text-xl font-bold text-red-400">₹{totalReceivable.toLocaleString()}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm text-center">
                <p className="text-xs text-green-400 font-medium uppercase tracking-wider mb-1">I Owe</p>
                <p className="text-xl font-bold text-green-400">₹{totalPayable.toLocaleString()}</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm"
                placeholder="Search People..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  <p>No people found.</p>
                  <p className="text-sm">Add a person to track money.</p>
                </div>
              ) : (
                filteredCustomers.map(customer => (
                  <div 
                    key={customer.id} 
                    onClick={() => onSelectCustomer(customer.id)}
                    className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/80 active:scale-[0.99] transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-200">{customer.name}</h3>
                          <p className="text-xs text-slate-500">{customer.mobile}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${customer.balance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ₹{Math.abs(customer.balance).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 font-medium uppercase">
                        {customer.balance > 0 ? 'Owes You' : customer.balance < 0 ? 'You Owe' : 'Settled'}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600 ml-3" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'EXPENSES' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm text-center">
               <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Total Spent (All Time)</p>
               <p className="text-3xl font-bold text-slate-200 mt-2">₹{totalExpenses.toLocaleString()}</p>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
               <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-300">Recent Spending</h3>
                 <span className="text-xs text-slate-500">{expenses.length} records</span>
               </div>
               {expenses.length === 0 ? (
                 <div className="p-8 text-center text-slate-600">
                   <p>No expenses recorded yet.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-slate-800">
                   {expenses.map(exp => {
                     const catConfig = getCategoryConfig(exp.category);
                     const Icon = catConfig.icon;
                     return (
                       <div key={exp.id} className="p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-center space-x-3">
                             <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${catConfig.color}`}>
                               <Icon className="h-5 w-5" />
                             </div>
                             <div>
                               <p className="font-medium text-slate-200">{exp.category}</p>
                               <p className="text-xs text-slate-500">{exp.description} • {new Date(exp.date).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <span className="font-bold text-slate-200">- ₹{exp.amount.toLocaleString()}</span>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          onClick={() => activeTab === 'PEOPLE' ? setShowAddModal(true) : setShowExpenseModal(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white rounded-full p-4 shadow-lg shadow-primary-900/40 flex items-center justify-center transition-all transform hover:scale-105"
        >
          <Plus className="h-6 w-6" />
          <span className="ml-2 font-medium hidden sm:inline">
            {activeTab === 'PEOPLE' ? 'Add Person' : 'Add Expense'}
          </span>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white flex items-center">
                 <Settings className="mr-2 h-5 w-5" /> Settings
               </h2>
               <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">✕</button>
             </div>
             
             <div className="space-y-6">
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-semibold text-primary-400 mb-2 flex items-center">
                    <Cloud className="mr-2 h-4 w-4" /> Backup to Drive
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Download your data as a file. Save this file to your Google Drive folder on your phone to keep it safe.
                  </p>
                  <Button variant="primary" fullWidth onClick={handleBackup}>
                    <Download className="mr-2 h-4 w-4" /> Download Backup File
                  </Button>
               </div>

               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-semibold text-green-400 mb-2 flex items-center">
                    <Upload className="mr-2 h-4 w-4" /> Restore Data
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Select a previously downloaded backup file to restore your data.
                  </p>
                  <label className="flex items-center justify-center w-full px-4 py-3 border border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-slate-800 transition">
                    <span className="text-sm text-slate-300">Choose Backup File</span>
                    <input type="file" className="hidden" accept=".json" onChange={handleRestore} />
                  </label>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-white">Add Person</h2>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <Input 
                label="Name"
                placeholder="Friend, Shopkeeper, etc."
                value={newCustomerName}
                onChange={e => setNewCustomerName(e.target.value)}
                required
              />
              <Input 
                label="Mobile Number"
                type="tel"
                placeholder="Optional"
                value={newCustomerMobile}
                onChange={e => setNewCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
              <div className="flex space-x-3 pt-2">
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" fullWidth>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
           <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
             <h2 className="text-xl font-bold mb-4 text-white">Add Expense</h2>
             <form onSubmit={handleAddExpense} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                 <input 
                   type="number" 
                   className="block w-full text-3xl font-bold border-b-2 border-slate-700 focus:border-primary-500 focus:outline-none p-2 bg-transparent text-white placeholder-slate-600"
                   placeholder="₹0"
                   value={expenseAmount}
                   onChange={e => setExpenseAmount(e.target.value)}
                   autoFocus
                   required
                 />
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {EXPENSE_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setExpenseCategory(cat.id)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                          expenseCategory === cat.id 
                            ? 'border-primary-500 bg-primary-500/20 ring-1 ring-primary-500/50' 
                            : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                        }`}
                      >
                        <cat.icon className={`h-6 w-6 mb-1 ${expenseCategory === cat.id ? 'text-primary-400' : 'text-slate-500'}`} />
                        <span className={`text-xs ${expenseCategory === cat.id ? 'font-bold text-primary-300' : 'text-slate-500'}`}>
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>
               </div>

               <Input 
                 label="Description (Optional)"
                 placeholder="What did you buy?"
                 value={expenseDesc}
                 onChange={e => setExpenseDesc(e.target.value)}
               />

               <Input 
                 label="Date"
                 type="date"
                 value={expenseDate}
                 onChange={e => setExpenseDate(e.target.value)}
                 required
                 className="dark-date-input"
               />

               <div className="flex space-x-3 pt-2">
                 <Button type="button" variant="secondary" fullWidth onClick={() => setShowExpenseModal(false)}>
                   Cancel
                 </Button>
                 <Button type="submit" fullWidth>
                   Save Expense
                 </Button>
               </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};