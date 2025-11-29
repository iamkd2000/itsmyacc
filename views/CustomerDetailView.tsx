import React, { useState, useEffect, useRef } from 'react';
import { Customer, Transaction } from '../types';
import { getCustomerById, getTransactions, addTransaction, updateTransaction } from '../services/storage';
import { generateCustomerPDF } from '../services/pdfGenerator';
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  MessageCircle, 
  FileDown, 
  Pencil,
  ArrowUp,
  ArrowDown,
  Share2,
  Clock,
  CheckCircle2,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface CustomerDetailViewProps {
  customerId: string;
  onBack: () => void;
}

export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ customerId, onBack }) => {
  const [customer, setCustomer] = useState<Customer | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txType, setTxType] = useState<'CREDIT' | 'PAYMENT' | null>(null);
  
  // Transaction Form State
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  useEffect(() => {
    // Scroll to bottom on load if needed, but for history usually we see bottom
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transactions]);

  const loadData = () => {
    const cust = getCustomerById(customerId);
    setCustomer(cust);
    if (cust) {
      // Get transactions (Newest first by default from storage)
      const txs = getTransactions(cust.id);
      // We need Oldest -> Newest for chronological chat view
      setTransactions([...txs].reverse());
    }
  };

  const handleSendReminder = () => {
    if (!customer?.mobile) {
      alert("No mobile number available.");
      return;
    }
    const cleanNumber = customer.mobile.replace(/\D/g, '');
    const absAmount = Math.abs(customer.balance).toLocaleString();
    
    // Updated message format including Account and Statement details
    const message = `Dear ${customer.name},
Your account statement alert.
Total Balance Due: ₹${absAmount}.
Please pay the pending amount.`;

    window.location.href = `sms:${cleanNumber}?body=${encodeURIComponent(message)}`;
  };

  const handleWhatsApp = () => {
    if (!customer?.mobile) return;
    const cleanNumber = customer.mobile.replace(/\D/g, '');
    // If number doesn't include country code, assume India +91
    const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    
    const absAmount = Math.abs(customer.balance).toLocaleString();
    const message = `Dear ${customer.name},
Your account statement alert.
Total Balance Due: ₹${absAmount}.
Please pay the pending amount.`;

    window.open(`https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadPDF = () => {
    if (customer && transactions) {
      // Pass original sorted transactions (Newest First) or re-sort inside generator
      // Generator usually expects specific format, but here we just pass list.
      // Let's pass the chronological list and let generator handle it, or reverse back if needed.
      // Standard statements are usually Oldest -> Newest or vice versa.
      generateCustomerPDF(customer, transactions);
    }
  };

  const handleEditClick = (t: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setTxType(t.type);
    setEditingTxId(t.id);
    setAmount(t.amount.toString());
    setDescription(t.description);
    setDate(new Date(t.date).toISOString().split('T')[0]);
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !txType) return;
    
    const txData = {
      customerId: customer.id,
      type: txType,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description: description || (txType === 'CREDIT' ? 'Gave Money' : 'Received Money'),
    };

    if (editingTxId) {
      updateTransaction({ ...txData, id: editingTxId });
    } else {
      addTransaction(txData);
    }

    // Reset and reload
    setTxType(null);
    setEditingTxId(null);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    loadData();
  };

  // Helper to format date for separator
  const formatDatePill = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Calculate running balances and group by date
  let runningBalance = 0;
  const processedTransactions = transactions.map(t => {
    if (t.type === 'CREDIT') {
      runningBalance += t.amount;
    } else {
      runningBalance -= t.amount;
    }
    return { ...t, runningBalance };
  });

  if (!customer) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white py-3 px-4 shadow-md sticky top-0 z-20">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-800 transition">
              <ArrowLeft className="h-6 w-6 text-slate-300" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-white leading-tight">{customer.name}</h1>
              <button className="text-xs text-green-400 font-medium text-left flex items-center hover:underline">
                View Profile <CheckCircle2 className="h-3 w-3 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <button onClick={handleDownloadPDF} title="Report" className="text-slate-400 hover:text-white transition">
                <FileDown className="h-5 w-5" />
             </button>
             <button onClick={handleWhatsApp} title="WhatsApp" className="text-green-500 hover:text-green-400 transition">
                <MessageCircle className="h-6 w-6" />
             </button>
             <button onClick={() => window.location.href=`tel:${customer.mobile}`} title="Call" className="text-slate-400 hover:text-white transition">
                <Phone className="h-5 w-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Chat/Timeline Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full pb-48 overflow-y-auto p-4 custom-scrollbar">
        {processedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
             <Clock className="h-12 w-12 mb-2 opacity-20" />
             <p>No transactions yet.</p>
             <p className="text-xs">Add a transaction below.</p>
          </div>
        ) : (
          processedTransactions.map((t, index) => {
            const showDateSeparator = 
              index === 0 || 
              new Date(t.date).toDateString() !== new Date(processedTransactions[index - 1].date).toDateString();
            
            const isCredit = t.type === 'CREDIT'; // You Gave (Red Arrow Up)
            
            return (
              <React.Fragment key={t.id}>
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <span className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-700 shadow-sm">
                      {formatDatePill(t.date)}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col mb-4 animate-fade-in-up">
                   <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 shadow-sm relative max-w-sm w-full mx-auto">
                      {/* Top Row: Icon + Amount + Time */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                           {isCredit ? (
                             <ArrowUp className="h-5 w-5 text-red-500" />
                           ) : (
                             <ArrowDown className="h-5 w-5 text-green-500" />
                           )}
                           <span className={`text-xl font-bold ${isCredit ? 'text-slate-200' : 'text-slate-200'}`}>
                             ₹{t.amount.toLocaleString()}
                           </span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                           <span>{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           <CheckCircle2 className="h-3 w-3 ml-1 text-slate-600" />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-sm text-slate-400 mb-2 pl-7">
                        {t.description}
                      </div>

                      {/* Footer inside card: Edit info or Edit button */}
                      {t.isEdited && (
                        <div className="absolute right-3 bottom-3 text-[10px] text-slate-600 italic">
                          Edited
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => handleEditClick(t, e)}
                        className="absolute top-3 right-3 p-1 text-slate-600 hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <Pencil className="h-3 w-3" />
                      </button>
                   </div>
                   
                   {/* Running Balance Label Below Card */}
                   <div className="flex justify-end max-w-sm mx-auto w-full mt-1">
                      <span className="text-xs text-slate-500 font-medium">
                         {t.runningBalance > 0 
                           ? `₹${t.runningBalance.toLocaleString()} Due` 
                           : t.runningBalance < 0 
                             ? `₹${Math.abs(t.runningBalance).toLocaleString()} Adv` 
                             : 'Settled'}
                      </span>
                   </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={bottomRef} />
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 z-30">
        <div className="max-w-3xl mx-auto w-full">
           
           {/* Action Tools Row */}
           <div className="grid grid-cols-2 border-b border-slate-800">
              <button className="flex items-center justify-center py-3 space-x-2 text-slate-400 hover:bg-slate-900 transition border-r border-slate-800">
                 <Calendar className="h-4 w-4" />
                 <span className="text-sm font-medium">Set Due Date</span>
              </button>
              <button 
                onClick={handleSendReminder}
                className="flex items-center justify-center py-3 space-x-2 text-green-500 hover:bg-green-900/10 transition"
              >
                 <Settings className="h-4 w-4" />
                 <span className="text-sm font-medium">Auto Reminder</span>
              </button>
           </div>

           {/* Balance Summary Row */}
           <div className="bg-slate-900/50 py-2 px-4 flex justify-between items-center cursor-pointer hover:bg-slate-900">
              <span className="text-sm text-slate-400">Balance Due</span>
              <div className="flex items-center text-red-400 font-bold">
                 <span>₹{Math.abs(customer.balance).toLocaleString()}</span>
                 <span className="ml-2 text-slate-600">&gt;</span>
              </div>
           </div>

           {/* Big Buttons Row */}
           <div className="flex p-3 gap-3 bg-slate-950">
             <button 
               onClick={() => { setTxType('PAYMENT'); setEditingTxId(null); setAmount(''); setDescription(''); }}
               className="flex-1 bg-white hover:bg-slate-50 active:scale-[0.98] transition rounded-xl py-3 flex items-center justify-center space-x-2 border border-slate-200 shadow-sm"
             >
                <ArrowDown className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-bold text-lg">Received</span>
             </button>
             <button 
               onClick={() => { setTxType('CREDIT'); setEditingTxId(null); setAmount(''); setDescription(''); }}
               className="flex-1 bg-white hover:bg-slate-50 active:scale-[0.98] transition rounded-xl py-3 flex items-center justify-center space-x-2 border border-slate-200 shadow-sm"
             >
                <ArrowUp className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-bold text-lg">Given</span>
             </button>
           </div>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {txType && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 w-full sm:max-w-md sm:rounded-xl rounded-t-xl shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in-up border border-slate-800">
            <div className={`p-4 text-white flex justify-between items-center ${txType === 'CREDIT' ? 'bg-red-600' : 'bg-green-600'}`}>
              <h2 className="text-lg font-bold">
                {editingTxId ? 'Edit Entry' : (txType === 'CREDIT' ? 'Add Given (Credit)' : 'Add Received (Payment)')}
              </h2>
              <button onClick={() => { setTxType(null); setEditingTxId(null); }} className="text-white opacity-80 hover:opacity-100 p-1 bg-black/20 rounded-full">✕</button>
            </div>
            
            <form onSubmit={handleSubmitTransaction} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  className={`block w-full text-4xl font-bold border-b-2 focus:outline-none p-2 bg-transparent ${txType === 'CREDIT' ? 'border-red-800 text-red-500 focus:border-red-500' : 'border-green-800 text-green-500 focus:border-green-500'}`}
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <Input 
                label="Description"
                placeholder={txType === 'CREDIT' ? "Items, Cash, etc." : "Cash, Online, etc."}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <Input 
                label="Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="dark-date-input"
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  fullWidth 
                  className={txType === 'CREDIT' ? '!bg-red-600 hover:!bg-red-700' : '!bg-green-600 hover:!bg-green-700'}
                  disabled={!amount}
                >
                  {editingTxId ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};