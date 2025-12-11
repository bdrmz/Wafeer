import React, { useState } from 'react';
import { Transaction } from '../types';
import { Card } from './ui/Card';
import { PlusIcon, XMarkIcon, FunnelIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface TransactionsListProps {
  transactions: Transaction[];
  onAddTransaction?: (tx: Transaction) => void;
  t: any;
  isSnippet?: boolean;
  onViewAll?: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, onAddTransaction, t, isSnippet = false, onViewAll }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Shopping',
    amount: ''
  });

  const categories = ['Groceries', 'Dining', 'Shopping', 'Utilities', 'Entertainment', 'Transport', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.merchant || !newTx.amount || !onAddTransaction) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTx.date,
      merchant: newTx.merchant,
      category: newTx.category,
      amount: parseFloat(newTx.amount),
      isSubscription: false
    };

    onAddTransaction(transaction);
    setIsAdding(false);
    setNewTx({
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      category: 'Shopping',
      amount: ''
    });
  };

  const filteredTransactions = selectedCategory === 'All' 
    ? transactions 
    : transactions.filter(t => t.category === selectedCategory);
  
  const displayTransactions = isSnippet ? transactions.slice(0, 5) : filteredTransactions;

  return (
    <Card 
      title={t.transactions.recent}
      className={isSnippet ? '' : "h-full"}
      action={
        onAddTransaction && !isAdding && !isSnippet ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
          >
            <PlusIcon className="w-3 h-3" />
            {t.transactions.addManual}
          </button>
        ) : null
      }
    >
      {/* Category Filters - Hide in snippet mode */}
      {!isSnippet && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
           <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === 'All' 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
           >
              {t.common.all}
           </button>
           {categories.map(cat => (
              <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      selectedCategory === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
              >
                  {t.categories[cat] || cat}
              </button>
           ))}
        </div>
      )}

      {/* Add Transaction Form */}
      {isAdding && !isSnippet && (
        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
             <h4 className="text-sm font-semibold text-[#16310c]">{t.transactions.newTx}</h4>
             <button onClick={() => setIsAdding(false)} className="text-[#16310c]/50 hover:text-[#16310c]">
               <XMarkIcon className="w-4 h-4" />
             </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.common.date}</label>
                <input 
                  type="date"
                  required
                  value={newTx.date}
                  onChange={e => setNewTx({...newTx, date: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.common.amount} ({t.common.sar})</label>
                <input 
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newTx.amount}
                  onChange={e => setNewTx({...newTx, amount: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.transactions.merchant}</label>
                <input 
                  type="text"
                  required
                  value={newTx.merchant}
                  onChange={e => setNewTx({...newTx, merchant: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Starbucks"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.transactions.category}</label>
                <select 
                  value={newTx.category}
                  onChange={e => setNewTx({...newTx, category: e.target.value})}
                  className="w-full px-3 py-1.5 text-sm border rounded bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{t.categories[c] || c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2 gap-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-[#16310c]/70 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t.transactions.saveTx}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        {displayTransactions.length === 0 ? (
            <div className="py-8 text-center text-[#16310c]/40 text-sm">
                <FunnelIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No transactions found.
            </div>
        ) : (
            <table className="w-full text-sm text-start">
            <thead className="text-xs text-[#16310c]/60 uppercase bg-slate-50/50 border-b border-slate-100">
                <tr>
                <th className="px-4 py-3 font-medium text-start">{t.common.date}</th>
                <th className="px-4 py-3 font-medium text-start">{t.transactions.merchant}</th>
                <th className="px-4 py-3 font-medium text-start">{t.transactions.category}</th>
                <th className="px-4 py-3 font-medium text-end">{t.common.amount}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {displayTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-[#16310c]/60 whitespace-nowrap">{tx.date}</td>
                    <td className="px-4 py-3 font-medium text-[#16310c]">
                    {tx.merchant}
                    {tx.isSubscription && (
                        <span className="mx-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">
                        SUB
                        </span>
                    )}
                    </td>
                    <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-[#16310c]/80 whitespace-nowrap">
                        {t.categories[tx.category] || tx.category}
                    </span>
                    </td>
                    <td className="px-4 py-3 text-end font-medium text-[#16310c] whitespace-nowrap">
                    {t.common.sar} {tx.amount.toFixed(2)}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
      <div className="mt-4 text-center">
        {isSnippet ? (
           <button 
             onClick={onViewAll} 
             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1 w-full py-2 hover:bg-indigo-50 rounded-lg transition-colors"
           >
             {t.transactions.viewAll} <ArrowRightIcon className="w-4 h-4" />
           </button>
        ) : (
           <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
             {t.transactions.viewAll}
           </button>
        )}
      </div>
    </Card>
  );
};