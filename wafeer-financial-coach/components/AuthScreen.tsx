import React, { useState } from 'react';
import { UserProfile, FinancialObligation, ObligationType } from '../types';
import { 
    ArrowRightIcon, 
    ChevronDownIcon, 
    TrashIcon
} from '@heroicons/react/24/outline';
import { translations } from '../translations';

interface AuthScreenProps {
    onLogin: (profile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [step, setStep] = useState(0);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [income, setIncome] = useState('');
    const [goal, setGoal] = useState('');

    const [obligations, setObligations] = useState<FinancialObligation[]>([]);
    const [showObDropdown, setShowObDropdown] = useState(false);
    const [tempObType, setTempObType] = useState<ObligationType | null>(null);

    const [familyCount, setFamilyCount] = useState<string>('');
    const [familyMembers, setFamilyMembers] = useState<{amount: string, day: string}[]>([]);

    const [loanAmount, setLoanAmount] = useState('');
    const [loanDay, setLoanDay] = useState('');
    const [loanEndYear, setLoanEndYear] = useState('');

    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

    const t = translations['en'].onboarding;

    const eventOptions = [
        { id: 'school', label: t.backToSchool, icon: '🎒' },
        { id: 'travel', label: t.travelPlan, icon: '✈️' },
        { id: 'ramadan', label: t.ramadan, icon: '🌙' },
        { id: 'eids', label: t.eids, icon: '🎉' },
        { id: 'hajj', label: t.hajjUmrah, icon: '🕋' },
        { id: 'other', label: t.other, icon: '✨' },
    ];

    const handleAuthSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignUp) {
            setStep(1);
        } else {
            finalizeLogin();
        }
    };

    const handleFamilyCountChange = (count: string) => {
        setFamilyCount(count);
        const parsed = parseInt(count);
        const num = (isNaN(parsed) || parsed < 0) ? 0 : Math.min(parsed, 20);
        setFamilyMembers(Array.from({ length: num }, () => ({ amount: '', day: '' })));
    };

    const updateFamilyMember = (index: number, field: 'amount' | 'day', value: string) => {
        const newMembers = [...familyMembers];
        newMembers[index] = { ...newMembers[index], [field]: value };
        setFamilyMembers(newMembers);
    };

    const addObligation = () => {
        if (!tempObType) return;

        if (tempObType === 'Family') {
            const newObs: FinancialObligation[] = familyMembers.map((m, idx) => ({
                id: Date.now().toString() + idx,
                type: 'Family',
                name: `Family Member ${idx + 1}`,
                amount: parseFloat(m.amount) || 0,
                dayOfMonth: parseInt(m.day) || 1
            }));
            setObligations([...obligations, ...newObs]);
        } else {
            const newOb: FinancialObligation = {
                id: Date.now().toString(),
                type: tempObType,
                name: tempObType === 'Loan' ? 'Personal Loan' : tempObType === 'Installment' ? 'Installment Plan' : 'Obligation',
                amount: parseFloat(loanAmount) || 0,
                dayOfMonth: parseInt(loanDay) || 1,
                endYear: parseInt(loanEndYear) || undefined
            };
            setObligations([...obligations, newOb]);
        }

        setTempObType(null);
        setShowObDropdown(false);
        setFamilyCount('');
        setFamilyMembers([]);
        setLoanAmount('');
        setLoanDay('');
        setLoanEndYear('');
    };

    const toggleEvent = (id: string) => {
        if (selectedEvents.includes(id)) {
            setSelectedEvents(selectedEvents.filter(e => e !== id));
        } else {
            setSelectedEvents([...selectedEvents, id]);
        }
    };

    const finalizeLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            const profile: UserProfile = {
                name: isSignUp ? name : "Wafeer",
                monthlyIncome: parseFloat(income) || 20000,
                currency: 'SAR',
                savingsGoal: parseFloat(goal) || 40000,
                language: 'en',
                obligations: obligations,
                interestedEvents: selectedEvents
            };
            onLogin(profile);
            setIsLoading(false);
        }, 1500);
    };

    const renderAuthForm = () => (
        <div className="p-8 animate-in fade-in">
            <div className="flex gap-4 mb-8 bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isSignUp ? 'bg-white text-[#16310c] shadow-sm' : 'text-[#16310c]/50 hover:text-[#16310c]/80'}`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isSignUp ? 'bg-white text-[#16310c] shadow-sm' : 'text-[#16310c]/50 hover:text-[#16310c]/80'}`}
                >
                    Create Account
                </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && (
                    <div>
                        <label className="block text-xs font-semibold text-[#16310c]/70 mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            required={isSignUp}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="Wafeer AlWafeer"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-[#16310c]/70 mb-1 ml-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Wafeer@example.com"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#16310c]/70 mb-1 ml-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {isSignUp && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-[#16310c]/70 mb-1 ml-1">Monthly Income (SAR)</label>
                            <select
                                required
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                className="w-full h-[50px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            >
                                <option value="">Select Income</option>
                                {Array.from({ length: 10 }, (_, i) => (i + 1) * 5000).map(val => (
                                    <option key={val} value={val}>{val.toLocaleString()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-[#16310c]/70 mb-1 ml-1">Savings Goal (SAR)</label>
                            <input
                                type="number"
                                required={isSignUp}
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                className="w-full h-[50px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-3.5 bg-[#16310c] text-white font-semibold rounded-xl hover:bg-[#16310c]/90 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 mt-2"
                >
                    {isSignUp ? translations.en.common.next : 'Sign In'} <ArrowRightIcon className="w-4 h-4" />
                </button>
            </form>
        </div>
    );

    const renderObligationsStep = () => (
        <div className="p-8 animate-in slide-in-from-right space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#16310c]">{t.obligationsTitle}</h2>
                <p className="text-sm text-[#16310c]/60">{t.obligationsDesc}</p>
            </div>

            {obligations.length > 0 && (
                <div className="space-y-2 mb-4">
                    {obligations.map((ob, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mr-2">{ob.type}</span>
                                <span className="text-sm font-medium">{ob.name}</span>
                                <div className="text-xs text-[#16310c]/50">Day {ob.dayOfMonth} • SAR {ob.amount}</div>
                            </div>
                            <button onClick={() => setObligations(obligations.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!tempObType ? (
                <div className="relative">
                    <button 
                        onClick={() => setShowObDropdown(!showObDropdown)}
                        className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 font-medium hover:bg-indigo-50 transition-colors flex justify-center items-center gap-2"
                    >
                        <ChevronDownIcon className="w-5 h-5" />
                        {t.addObligation}
                    </button>
                    {showObDropdown && (
                        <div className="mt-3 space-y-3">
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-xl" onClick={() => setTempObType('Family')}>Family</button>
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-xl" onClick={() => setTempObType('Loan')}>Loan</button>
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-xl" onClick={() => setTempObType('Installment')}>Installment</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-indigo-900">{tempObType} Details</h4>
                        <button onClick={() => setTempObType(null)} className="text-xs text-red-500 hover:underline">{translations.en.common.cancel}</button>
                    </div>
                    
                    {tempObType === 'Family' ? (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.memberCount}</label>
                                <input 
                                    type="number" 
                                    value={familyCount}
                                    onChange={(e) => handleFamilyCountChange(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    placeholder="e.g. 3"
                                    min="0"
                                />
                            </div>
                            {familyMembers.map((member, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder={`${t.memberAmount} ${idx + 1} (SAR)`}
                                        value={member.amount}
                                        onChange={(e) => updateFamilyMember(idx, 'amount', e.target.value)}
                                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                    />
                                    <input 
                                        type="number"
                                        placeholder={t.deductionDay} 
                                        min="1" max="31"
                                        value={member.day}
                                        onChange={(e) => updateFamilyMember(idx, 'day', e.target.value)}
                                        className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.totalAmount} (SAR)</label>
                                    <input 
                                        type="number" 
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.deductionDay} (1-31)</label>
                                    <input 
                                        type="number" 
                                        min="1" max="31"
                                        value={loanDay}
                                        onChange={(e) => setLoanDay(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#16310c]/70 mb-1">{t.endYear}</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 2028"
                                    value={loanEndYear}
                                    onChange={(e) => setLoanEndYear(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                        </>
                    )}
                    
                    <button 
                        onClick={addObligation}
                        className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Save Obligation
                    </button>
                </div>
            )}

            <button 
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-[#16310c] text-white font-semibold rounded-xl hover:bg-[#16310c]/90 transition-all flex items-center justify-center gap-2 mt-4"
            >
                {translations.en.common.next} <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    );

    const renderEventsStep = () => (
        <div className="p-8 animate-in slide-in-from-right space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#16310c]">{t.eventsTitle}</h2>
                <p className="text-sm text-[#16310c]/60">{t.eventsDesc}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {eventOptions.map(evt => (
                    <button
                        key={evt.id}
                        onClick={() => toggleEvent(evt.id)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedEvents.includes(evt.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                    >
                        <span className="text-2xl">{evt.icon}</span>
                        <span className="text-xs font-semibold text-center">{evt.label}</span>
                    </button>
                ))}
            </div>

            <button 
                onClick={finalizeLogin}
                className="w-full py-3.5 bg-[#16310c] text-white font-semibold rounded-xl hover:bg-[#16310c]/90 transition-all flex items-center justify-center gap-2 mt-4"
            >
                {translations.en.common.finish} <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-[#16310c]">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative">
                {/* Back Button */}
                {step > 0 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="absolute top-4 left-4 z-20 text-white/80 hover:text-white text-xs font-medium"
                    >
                        ← {translations.en.common.back}
                    </button>
                )}

                <div className="bg-gradient-to-br from-[#16310c] via-[#1a3a0f] to-[#16310c] p-8 text-center relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-emerald-400/20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-40 h-40 rounded-full bg-teal-400/20 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        {step === 0 && (
                            <>
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/20 mb-4">
                                    <span className="text-5xl font-bold text-[#16310c]">W</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Wafeer</h1>
                                <p className="text-emerald-100/90 text-sm font-medium">يوفر قرشك الابيض ليومك الاسود</p>
                            </>
                        )}
                        {step === 1 && <h1 className="text-2xl font-bold text-white mt-4 mb-2">Step 2 of 3</h1>}
                        {step === 2 && <h1 className="text-2xl font-bold text-white mt-4 mb-2">Final Step</h1>}
                    </div>
                </div>

                {step === 0 && renderAuthForm()}
                {step === 1 && renderObligationsStep()}
                {step === 2 && renderEventsStep()}
            </div>
        </div>
    );
};