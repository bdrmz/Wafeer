import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { ForecastEvent, PaymentCard, UserProfile, Transaction } from '../types';
import { TransactionsList } from './TransactionsList';
import { 
    CreditCardIcon, 
    PlusIcon, 
    ShieldCheckIcon, 
    BanknotesIcon,
    CalendarDaysIcon,
    ArrowPathIcon,
    LockClosedIcon,
    CheckCircleIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    ArrowRightIcon,
    ExclamationCircleIcon,
    TagIcon
} from '@heroicons/react/24/outline';

interface WalletViewProps {
    profile: UserProfile;
    events: ForecastEvent[];
    transactions: Transaction[];
    onAddTransaction: (tx: Transaction) => void;
    t: any;
}

export const WalletView: React.FC<WalletViewProps> = ({ profile, events, transactions, onAddTransaction, t }) => {
    // --- State: Cards ---
    const [cards, setCards] = useState<PaymentCard[]>([
        { id: '1', type: 'Mada', last4: '4242', expiry: '12/25', holder: profile.name.toUpperCase(), color: 'bg-gradient-to-br from-indigo-600 to-blue-800', isDefault: true, balance: 15420 },
        { id: '2', type: 'Visa', last4: '8831', expiry: '09/26', holder: profile.name.toUpperCase(), color: 'bg-gradient-to-br from-slate-700 to-slate-900', isDefault: false, balance: 3200 }
    ]);
    
    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        type: 'Visa',
        last4: '',
        expiry: '',
        holder: '',
        color: 'bg-gradient-to-br from-indigo-600 to-blue-800'
    });

    // --- State: Automation & Transfers ---
    const [isAutomated, setIsAutomated] = useState(false);
    const [selectedSourceId, setSelectedSourceId] = useState<string>(cards[0]?.id || '');
    
    // Automation Config
    const [manualOverrideAmount, setManualOverrideAmount] = useState<string>('');
    
    // Manual Transfer Logic
    const [manualTransferAmount, setManualTransferAmount] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);
    const [transferSuccess, setTransferSuccess] = useState<string | null>(null);
    const [transferError, setTransferError] = useState<string | null>(null);

    // --- Constants ---
    const cardColors = [
        { name: 'Indigo', class: 'bg-gradient-to-br from-indigo-600 to-blue-800' },
        { name: 'Slate', class: 'bg-gradient-to-br from-slate-700 to-slate-900' },
        { name: 'Emerald', class: 'bg-gradient-to-br from-emerald-600 to-teal-800' },
        { name: 'Rose', class: 'bg-gradient-to-br from-rose-500 to-red-700' },
        { name: 'Purple', class: 'bg-gradient-to-br from-violet-600 to-purple-800' }
    ];

    // --- Calculations for Automation Suggestion ---
    const eventNeeds = useMemo(() => {
        return events.reduce((acc, event) => {
            const months = Math.max(1, event.daysUntil / 30);
            return acc + (event.estimatedCost / months);
        }, 0);
    }, [events]);

    const goalNeeds = 2500;
    const emergencyMonthlyRecommend = 1000; 
    const totalRecommended = Math.round(eventNeeds + goalNeeds + emergencyMonthlyRecommend);

    // --- Active Subscriptions Calculation ---
    const subscriptions = useMemo(() => {
        const unique = new Map<string, Transaction>();
        transactions.forEach(t => {
            if (t.isSubscription && !unique.has(t.merchant)) {
                unique.set(t.merchant, t);
            }
        });
        return Array.from(unique.values());
    }, [transactions]);

    const totalSubsCost = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);

    // --- Handlers ---
    const handleAddNewClick = () => {
        setFormData({
            type: 'Visa',
            last4: '',
            expiry: '',
            holder: profile.name.toUpperCase(),
            color: cardColors[0].class
        });
        setEditingCardId(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (card: PaymentCard) => {
        setFormData({
            type: card.type,
            last4: card.last4,
            expiry: card.expiry,
            holder: card.holder,
            color: card.color
        });
        setEditingCardId(card.id);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        if (confirm('Are you sure you want to delete this card?')) {
            setCards(cards.filter(c => c.id !== id));
            if (selectedSourceId === id && cards.length > 1) {
                setSelectedSourceId(cards.find(c => c.id !== id)?.id || '');
            }
        }
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingCardId) {
            setCards(cards.map(c => c.id === editingCardId ? {
                ...c,
                type: formData.type as any,
                last4: formData.last4,
                expiry: formData.expiry,
                holder: formData.holder,
                color: formData.color
            } : c));
        } else {
            const newCard: PaymentCard = {
                id: Date.now().toString(),
                type: formData.type as any,
                last4: formData.last4,
                expiry: formData.expiry,
                holder: formData.holder,
                color: formData.color,
                isDefault: cards.length === 0,
                balance: 0 
            };
            setCards([...cards, newCard]);
            if (!selectedSourceId) setSelectedSourceId(newCard.id);
        }
        setIsFormOpen(false);
    };

    const handleManualTransfer = () => {
        const amount = parseFloat(manualTransferAmount);
        if (!amount || amount <= 0) return;
        
        const sourceCard = cards.find(c => c.id === selectedSourceId);
        if (!sourceCard) {
            setTransferError("Please select a funding source.");
            return;
        }

        if ((sourceCard.balance || 0) < amount) {
            setTransferError("Insufficient funds in selected account.");
            setTimeout(() => setTransferError(null), 3000);
            return;
        }

        setIsTransferring(true);
        setTransferError(null);
        
        // Simulate API call and Update State
        setTimeout(() => {
            // Deduct balance
            setCards(cards.map(c => c.id === selectedSourceId ? { ...c, balance: (c.balance || 0) - amount } : c));
            
            setIsTransferring(false);
            setTransferSuccess(`Successfully transferred ${t.common.sar} ${amount.toLocaleString()} to Vault`);
            setManualTransferAmount('');
            setTimeout(() => setTransferSuccess(null), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-fade-in text-[#16310c]">
            {/* Cards & Accounts Section */}
            <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-xl font-bold text-[#16310c]">{t.wallet.myCards}</h2>
                    {!isFormOpen && (
                        <button 
                            onClick={handleAddNewClick}
                            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            <PlusIcon className="w-4 h-4" /> {t.wallet.addCard}
                        </button>
                    )}
                </div>
                
                {/* Card Form */}
                {isFormOpen && (
                    <div className="mb-6 p-6 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-[#16310c]">
                                {editingCardId ? t.wallet.editCard : t.wallet.addCard}
                            </h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-[#16310c]/50 hover:text-[#16310c]">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveCard} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#16310c]/80 mb-1">Card Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Mastercard</option>
                                        <option value="Mada">Mada</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#16310c]/80 mb-1">Last 4 Digits</label>
                                    <input 
                                        type="text"
                                        maxLength={4}
                                        value={formData.last4}
                                        onChange={e => setFormData({...formData, last4: e.target.value.replace(/\D/g,'')})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                                        placeholder="1234"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#16310c]/80 mb-1">Expiration (MM/YY)</label>
                                    <input 
                                        type="text"
                                        value={formData.expiry}
                                        onChange={e => setFormData({...formData, expiry: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                                        placeholder="12/28"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#16310c]/80 mb-1">{t.wallet.cardHolder}</label>
                                    <input 
                                        type="text"
                                        value={formData.holder}
                                        onChange={e => setFormData({...formData, holder: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                                        placeholder="FULL NAME"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[#16310c]/80 mb-2">Card Appearance</label>
                                <div className="flex gap-3">
                                    {cardColors.map((c) => (
                                        <button
                                            key={c.name}
                                            type="button"
                                            onClick={() => setFormData({...formData, color: c.class})}
                                            className={`w-8 h-8 rounded-full ${c.class} transition-transform hover:scale-110 ${formData.color === c.class ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-[#16310c]/70 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    {t.common.cancel}
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                                >
                                    {editingCardId ? t.wallet.editCard : t.common.add}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cards.map(card => (
                        <div key={card.id} className={`group relative p-6 rounded-2xl text-white shadow-lg overflow-hidden transition-all hover:shadow-xl ${card.color}`}>
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black/10 blur-2xl"></div>
                            
                            <div className="relative z-10 flex flex-col justify-between h-32">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium tracking-wider opacity-80">{card.type}</span>
                                    {card.isDefault && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">{t.wallet.default}</span>}
                                    
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEditClick(card)}
                                            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                                            title="Edit"
                                        >
                                            <PencilSquareIcon className="w-4 h-4 text-white" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(card.id)}
                                            className="p-1.5 bg-white/20 hover:bg-rose-500/50 rounded-lg backdrop-blur-sm transition-colors"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2" dir="ltr">
                                    <p className="text-2xl font-mono tracking-widest">•••• •••• •••• {card.last4}</p>
                                </div>
                                <div className="flex justify-between items-end mt-4">
                                    <div>
                                        <p className="text-[10px] opacity-60 uppercase tracking-wider">{t.wallet.cardHolder}</p>
                                        <p className="text-sm font-medium tracking-wide">{card.holder}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] opacity-60 uppercase tracking-wider">{t.wallet.balance}</p>
                                        <p className="text-sm font-medium tracking-wide">{t.common.sar} {(card.balance || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {cards.length === 0 && !isFormOpen && (
                        <button 
                            onClick={handleAddNewClick}
                            className="h-44 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col justify-center items-center gap-3 text-[#16310c]/40 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
                        >
                            <PlusIcon className="w-6 h-6" />
                            <span className="text-sm font-medium">{t.wallet.addCard}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Smart Savings Manager (Automation) */}
            <Card title={t.wallet.smartSavings} className="border-indigo-100">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        {/* Toggle Header */}
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isAutomated ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-[#16310c]/60'}`}>
                                    <ArrowPathIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#16310c]">{t.wallet.autoSave}</p>
                                    <p className="text-xs text-[#16310c]/60">{isAutomated ? t.wallet.autoSaveActive : t.wallet.autoSavePaused}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={isAutomated} 
                                    onChange={(e) => setIsAutomated(e.target.checked)} 
                                    disabled={cards.length === 0}
                                    className="sr-only peer" 
                                />
                                <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${profile.language === 'ar' ? 'peer-checked:after:-translate-x-full after:right-[2px]' : 'peer-checked:after:translate-x-full after:left-[2px]'}`}></div>
                            </label>
                        </div>

                        {/* Shared: Source Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#16310c]/80 mb-2">{t.wallet.fundingSource}</label>
                            <select 
                                value={selectedSourceId} 
                                onChange={(e) => setSelectedSourceId(e.target.value)}
                                disabled={cards.length === 0}
                                className="w-full p-2.5 bg-white border border-slate-300 text-[#16310c] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {cards.map(c => (
                                    <option key={c.id} value={c.id}>{c.type} **{c.last4} {c.balance !== undefined ? `(${t.common.sar} ${c.balance.toLocaleString()})` : ''}</option>
                                ))}
                                {cards.length === 0 && <option>No cards available</option>}
                            </select>
                        </div>

                        {/* Conditional Content */}
                        {isAutomated ? (
                            <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#16310c]/80 mb-2">
                                        {t.wallet.contributionTarget}
                                        <span className="text-xs font-normal text-[#16310c]/60 mx-2">({t.wallet.recommended}: {t.common.sar} {totalRecommended})</span>
                                    </label>
                                    <div className="relative">
                                        <div className={`absolute inset-y-0 flex items-center pointer-events-none ${profile.language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                            <span className="text-[#16310c]/60 sm:text-sm">{t.common.sar}</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            value={manualOverrideAmount}
                                            onChange={(e) => setManualOverrideAmount(e.target.value)}
                                            placeholder={totalRecommended.toString()}
                                            className={`w-full p-2.5 bg-white border border-indigo-200 text-[#16310c] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50/30 ${profile.language === 'ar' ? 'pr-12' : 'pl-12'}`}
                                        />
                                    </div>
                                    <div className="mt-2 flex items-start gap-2 text-xs text-indigo-700">
                                        <CalendarDaysIcon className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{t.wallet.nextDeduction}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 space-y-4 pt-2 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-[#16310c]">{t.wallet.oneTimeTransfer}</h4>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className={`absolute inset-y-0 flex items-center pointer-events-none ${profile.language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                                            <span className="text-[#16310c]/60 sm:text-sm">{t.common.sar}</span>
                                        </div>
                                        <input 
                                            type="number"
                                            value={manualTransferAmount}
                                            onChange={(e) => setManualTransferAmount(e.target.value)}
                                            placeholder={t.common.amount}
                                            className={`w-full p-2.5 bg-white border border-slate-300 text-[#16310c] text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${profile.language === 'ar' ? 'pr-12' : 'pl-12'}`}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleManualTransfer}
                                        disabled={isTransferring || !manualTransferAmount}
                                        className="px-4 py-2 bg-[#16310c] text-white text-sm font-medium rounded-lg hover:bg-[#16310c]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                                    >
                                        {isTransferring ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            <>
                                                {t.wallet.transfer} <ArrowRightIcon className={`w-4 h-4 ${profile.language === 'ar' ? 'rotate-180' : ''}`} />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {transferError && (
                                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg animate-in fade-in">
                                        <ExclamationCircleIcon className="w-4 h-4" />
                                        {transferError}
                                    </div>
                                )}
                                {transferSuccess && (
                                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg animate-in fade-in">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        {transferSuccess}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full h-px md:w-px md:h-auto bg-slate-200"></div>
                    
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <ShieldCheckIcon className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-indigo-900">{t.wallet.secureVault}</h3>
                        <p className="text-sm text-indigo-700 mb-4 max-w-xs mx-auto">
                            {t.wallet.vaultDesc}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-indigo-600 bg-white/80 px-3 py-1.5 rounded-full border border-indigo-200">
                            <LockClosedIcon className="w-3 h-3" />
                            <span>{t.wallet.encrypted}</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Active Subscriptions Section */}
            {subscriptions.length > 0 && (
                <Card 
                    title={t.wallet.activeSubscriptions} 
                    action={
                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                            <TagIcon className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-700">{t.wallet.totalMonthly}: {t.common.sar} {totalSubsCost.toFixed(2)}</span>
                        </div>
                    }
                >
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                        {subscriptions.map((sub, idx) => (
                            <div key={`sub-card-${idx}`} className="shrink-0 w-48 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg font-bold text-slate-600 mb-3 shadow-sm group-hover:bg-white transition-colors">
                                        {sub.merchant.charAt(0)}
                                    </div>
                                    <h4 className="font-semibold text-sm text-slate-800 truncate" title={sub.merchant}>{sub.merchant}</h4>
                                    <p className="text-xs text-slate-500 mb-3">{sub.category}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-slate-900">{t.common.sar} {sub.amount}</span>
                                        <span className="text-[10px] text-slate-400">/mo</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Transactions List */}
            <TransactionsList transactions={transactions} onAddTransaction={onAddTransaction} t={t} />
        </div>
    );
};