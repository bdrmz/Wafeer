import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { ForecastEvent } from '../types';
import {
    BanknotesIcon,
    CalendarDaysIcon,
    ShieldCheckIcon,
    CalculatorIcon,
    CheckCircleIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

interface SmartCalculatorProps {
    events: ForecastEvent[];
    onViewGoals: () => void;
    t: any;
}

export const SmartCalculator: React.FC<SmartCalculatorProps> = ({ events, onViewGoals, t }) => {
    // Interactive state for calculator
    const [emergencyTarget, setEmergencyTarget] = useState(20000);
    const [monthsToAchieve, setMonthsToAchieve] = useState(12);
    const [goalMonthlyContribution, setGoalMonthlyContribution] = useState(2500);

    // Calculations
    const eventNeeds = useMemo(() => {
        return events.reduce((acc, event) => {
            const months = Math.max(1, event.daysUntil / 30);
            return acc + (event.estimatedCost / months);
        }, 0);
    }, [events]);

    const emergencyMonthlyRecommend = Math.round(emergencyTarget / monthsToAchieve);
    const totalRecommended = Math.round(eventNeeds + goalMonthlyContribution + emergencyMonthlyRecommend);

    return (
        <div className="space-y-6 animate-fade-in text-[#16310c]">
             <Card className="bg-gradient-to-br from-[#16310c] to-[#0f2208] text-white border-none shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm shadow-inner">
                        <CalculatorIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{t.calculator.title}</h2>
                        <p className="text-emerald-200/80 text-sm">{t.calculator.subtitle}</p>
                    </div>
                </div>

                <div className="text-center py-6">
                    <p className="text-emerald-200/80 text-sm mb-2 uppercase tracking-widest font-medium">{t.calculator.recMonthly}</p>
                    <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-sm">
                        {t.common.sar} {totalRecommended.toLocaleString()}
                    </h1>
                    <p className="text-xs text-emerald-400/80 mt-3 bg-white/5 inline-block px-3 py-1 rounded-full">
                        {t.calculator.autoAdjust}
                    </p>
                </div>
             </Card>

             <h3 className="text-lg font-bold text-[#16310c] px-1">{t.calculator.breakdown}</h3>

             {/* Breakdown Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Events */}
                 <Card className="border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow rtl:border-l-0 rtl:border-r-4 rtl:border-r-indigo-500">
                    <div className="flex items-start justify-between mb-2">
                         <div className="p-2 bg-indigo-50 rounded-lg">
                            <CalendarDaysIcon className="w-6 h-6 text-indigo-600" />
                         </div>
                         <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded uppercase tracking-wide">{t.calculator.fixed}</span>
                    </div>
                    <h3 className="font-semibold text-[#16310c]">{t.calculator.upcomingEvents}</h3>
                    <p className="text-2xl font-bold mt-1 text-[#16310c]">{t.common.sar} {Math.round(eventNeeds).toLocaleString()}</p>
                    <p className="text-xs text-[#16310c]/60 mt-2">{t.calculator.allocatedFor.replace('{count}', events.length.toString())}.</p>
                 </Card>

                 {/* Emergency */}
                 <Card className="border-l-4 border-l-rose-500 hover:shadow-md transition-shadow rtl:border-l-0 rtl:border-r-4 rtl:border-r-rose-500">
                    <div className="flex items-start justify-between mb-2">
                         <div className="p-2 bg-rose-50 rounded-lg">
                            <ShieldCheckIcon className="w-6 h-6 text-rose-500" />
                         </div>
                         <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-1 rounded uppercase tracking-wide">{t.calculator.flexible}</span>
                    </div>
                    <h3 className="font-semibold text-[#16310c]">{t.calculator.emergencyFund}</h3>
                    <p className="text-2xl font-bold mt-1 text-[#16310c]">{t.common.sar} {emergencyMonthlyRecommend.toLocaleString()}</p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#16310c]/60">{t.calculator.targetAmount}</span>
                                <span className="font-bold">{t.common.sar} {emergencyTarget.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="100000"
                                step="1000"
                                value={emergencyTarget}
                                onChange={(e) => setEmergencyTarget(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#16310c]/60">{t.calculator.timeline}</span>
                                <span className="font-bold">{monthsToAchieve} {t.common.months}</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="36"
                                step="1"
                                value={monthsToAchieve}
                                onChange={(e) => setMonthsToAchieve(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                        </div>
                    </div>
                 </Card>

                 {/* Goals */}
                 <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow rtl:border-l-0 rtl:border-r-4 rtl:border-r-blue-500">
                    <div className="flex items-start justify-between mb-2">
                         <div className="p-2 bg-blue-50 rounded-lg">
                            <BanknotesIcon className="w-6 h-6 text-blue-500" />
                         </div>
                         <button onClick={onViewGoals} className="text-[10px] font-bold bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 transition-colors">
                            {t.calculator.viewGoals} <TrophyIcon className="w-3 h-3" />
                         </button>
                    </div>
                    <h3 className="font-semibold text-[#16310c]">{t.calculator.longTermGoals}</h3>
                    <p className="text-2xl font-bold mt-1 text-[#16310c]">{t.common.sar} {goalMonthlyContribution.toLocaleString()}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <label className="text-[10px] uppercase text-[#16310c]/50 font-bold">{t.calculator.monthlyCont}</label>
                        <div className="flex items-center gap-2 mt-2">
                             <button 
                                onClick={() => setGoalMonthlyContribution(p => Math.max(0, p - 500))} 
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-lg font-bold text-slate-600 transition-colors"
                             >-</button>
                             <div className="flex-1 text-center font-mono font-medium bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                                {t.common.sar} {goalMonthlyContribution}
                             </div>
                             <button 
                                onClick={() => setGoalMonthlyContribution(p => p + 500)} 
                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-lg font-bold text-slate-600 transition-colors"
                             >+</button>
                        </div>
                    </div>
                 </Card>
             </div>

             <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-[#16310c] flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                            {t.calculator.planReady}
                        </h3>
                        <p className="text-sm text-[#16310c]/70 mt-1">
                            {t.calculator.planDesc.replace('{amount}', `${t.common.sar} ${totalRecommended.toLocaleString()}`)}
                        </p>
                    </div>
                    <button className="w-full md:w-auto px-6 py-3 bg-[#16310c] text-white font-semibold rounded-xl hover:bg-[#16310c]/90 transition-colors shadow-lg shadow-emerald-900/10">
                        {t.calculator.updateWallet}
                    </button>
                </div>
             </Card>
        </div>
    );
};