import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Goal } from '../types';
import { 
    PencilSquareIcon, 
    CheckIcon, 
    PlusIcon, 
    ClockIcon,
    BellAlertIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { MoonIcon, GiftIcon } from '@heroicons/react/24/solid';

const getIconForGoal = (name: string): React.ElementType => {
    const n = name.toLowerCase();
    if (n.includes('emergency') || n.includes('fund') || n.includes('طوارئ')) return BellAlertIcon;
    if (n.includes('ramadan') || n.includes('prep') || n.includes('رمضان')) return MoonIcon;
    if (n.includes('eid') || n.includes('gift') || n.includes('فطر')) return GiftIcon;
    return BellAlertIcon;
};

interface GoalNavigatorProps {
    goals: Goal[];
    onUpdateGoals: (goals: Goal[]) => void;
    t: any;
}

export const GoalNavigator: React.FC<GoalNavigatorProps> = ({ goals, onUpdateGoals, t }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    //Goal State
    const [isAdding, setIsAdding] = useState(false);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [newGoalCurrent, setNewGoalCurrent] = useState('0');
    const [newGoalDeadline, setNewGoalDeadline] = useState('');
    
    // Recurring state
    const [enableRecurring, setEnableRecurring] = useState(false);
    const [recurringAmount, setRecurringAmount] = useState('');
    const [recurringFreq, setRecurringFreq] = useState<'Weekly' | 'Monthly'>('Monthly');

    const startEdit = (goal: Goal) => {
        setEditingId(goal.id);
        setEditValue(goal.target.toString());
    };

    const saveEdit = (id: string) => {
        onUpdateGoals(goals.map(g => g.id === id ? { ...g, target: parseInt(editValue) || g.target } : g));
        setEditingId(null);
    };

    const handleAddGoal = () => {
        if (!newGoalName || !newGoalTarget) return;
        
        const colors = [
            'from-indigo-400 to-indigo-600', 
            'from-pink-400 to-pink-600', 
            'from-orange-400 to-orange-600', 
            'from-cyan-400 to-cyan-600', 
            'from-rose-400 to-rose-600'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newGoal: Goal = {
            id: Date.now().toString(),
            name: newGoalName,
            target: parseFloat(newGoalTarget),
            current: parseFloat(newGoalCurrent) || 0,
            color: randomColor,
            deadline: newGoalDeadline || undefined,
            recurring: enableRecurring && recurringAmount ? {
                amount: parseFloat(recurringAmount),
                frequency: recurringFreq
            } : undefined
        };

        onUpdateGoals([...goals, newGoal]);
        
        // Reset and close
        setIsAdding(false);
        setNewGoalName('');
        setNewGoalTarget('');
        setNewGoalCurrent('0');
        setNewGoalDeadline('');
        setEnableRecurring(false);
        setRecurringAmount('');
    };

    const cancelAdd = () => {
        setIsAdding(false);
        setNewGoalName('');
        setNewGoalTarget('');
        setNewGoalCurrent('0');
        setNewGoalDeadline('');
        setEnableRecurring(false);
    }

    return (
        <Card title={t.goals.title} className="h-full !p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 text-[#16310c]">
                {goals.map(goal => {
                    const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
                    const Icon = getIconForGoal(goal.name);
                    return (
                        <div key={goal.id} className="relative p-2 rounded-lg border border-slate-50 hover:border-slate-100 transition-colors">
                            <div className="flex justify-between items-start mb-1.5">
                                <div className="flex gap-2 items-center min-w-0">
                                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${goal.color} bg-opacity-10 shadow-sm shrink-0`}>
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-[#16310c] text-xs truncate">{goal.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <p className="text-[10px] text-[#16310c]/70 whitespace-nowrap">{t.goals.current}: {t.common.sar} {goal.current.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end shrink-0 ml-1">
                                    {editingId === goal.id ? (
                                        <div className="flex items-center gap-1">
                                            <input 
                                                type="number" 
                                                value={editValue} 
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-14 px-1 py-0.5 text-xs border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                            <button onClick={() => saveEdit(goal.id)} className="text-green-600 hover:text-green-700">
                                                <CheckIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end cursor-pointer group" onClick={() => startEdit(goal)}>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-bold text-[#16310c]">{t.common.sar} {goal.target.toLocaleString()}</span>
                                                <PencilSquareIcon className="w-3 h-3 text-[#16310c]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-[9px] font-medium text-[#16310c]/50">{progress}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Metadata Badges */}
                            <div className="flex gap-1 mb-2 flex-wrap">
                                {goal.deadline && (
                                    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium bg-slate-50 text-[#16310c]/60 border border-slate-100">
                                        <CalendarDaysIcon className="w-2.5 h-2.5" />
                                        {goal.deadline}
                                    </span>
                                )}
                                {goal.recurring && (
                                    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-[#16310c]/80 border border-slate-200">
                                        <ClockIcon className="w-2.5 h-2.5" />
                                        {goal.recurring.frequency === 'Weekly' ? t.goals.weekly : t.goals.monthly}
                                    </span>
                                )}
                            </div>

                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className={`h-1.5 rounded-full bg-gradient-to-r ${goal.color} transition-all duration-1000 relative`} 
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
                {isAdding ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div>
                            <label className="block text-[10px] font-semibold text-[#16310c] mb-1">{t.goals.goalName}</label>
                            <input 
                                type="text" 
                                value={newGoalName}
                                onChange={(e) => setNewGoalName(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                                placeholder="e.g. Dream Vacation"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-[#16310c] mb-1">{t.goals.target} ({t.common.sar})</label>
                                <input 
                                    type="number" 
                                    value={newGoalTarget}
                                    onChange={(e) => setNewGoalTarget(e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                                    placeholder="5000"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-[#16310c] mb-1">{t.goals.current} ({t.common.sar})</label>
                                <input 
                                    type="number" 
                                    value={newGoalCurrent}
                                    onChange={(e) => setNewGoalCurrent(e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-semibold text-[#16310c] mb-1">{t.common.date} (Optional)</label>
                            <input 
                                type="date" 
                                value={newGoalDeadline}
                                onChange={(e) => setNewGoalDeadline(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                            />
                        </div>

                        <div className="pt-2 border-t border-slate-200/60">
                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input 
                                    type="checkbox" 
                                    checked={enableRecurring}
                                    onChange={(e) => setEnableRecurring(e.target.checked)}
                                    className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <span className="text-[10px] font-medium text-[#16310c]/80">{t.goals.recurring}</span>
                            </label>
                            
                            {enableRecurring && (
                                <div className="flex gap-2 pl-5 animate-in fade-in slide-in-from-top-1 rtl:pr-5 rtl:pl-0">
                                    <div className="flex-1">
                                        <input 
                                            type="number" 
                                            value={recurringAmount}
                                            onChange={(e) => setRecurringAmount(e.target.value)}
                                            className="w-full px-2 py-1.5 text-[10px] border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                            placeholder={`${t.common.amount} (${t.common.sar})`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <select 
                                            value={recurringFreq}
                                            onChange={(e) => setRecurringFreq(e.target.value as 'Weekly' | 'Monthly')}
                                            className="w-full px-2 py-1.5 text-[10px] border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            <option value="Weekly">{t.goals.weekly}</option>
                                            <option value="Monthly">{t.goals.monthly}</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-2 pt-1">
                            <button 
                                onClick={cancelAdd}
                                className="px-3 py-1.5 text-[10px] font-medium text-[#16310c]/70 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                {t.common.cancel}
                            </button>
                            <button 
                                onClick={handleAddGoal}
                                disabled={!newGoalName || !newGoalTarget}
                                className="px-3 py-1.5 text-[10px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.goals.saveGoal}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full py-2 bg-white hover:bg-slate-50 text-[#16310c]/70 rounded-lg text-xs font-medium transition-all border border-slate-200 border-dashed flex items-center justify-center gap-1.5 hover:border-indigo-300 hover:text-indigo-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        {t.goals.addGoal}
                    </button>
                )}
            </div>
        </Card>
    );
};