import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Card } from './ui/Card';
import { 
    UserCircleIcon, 
    BanknotesIcon, 
    CurrencyDollarIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    LanguageIcon
} from '@heroicons/react/24/outline';

interface ProfileSettingsProps {
    profile: UserProfile;
    onUpdateProfile: (p: UserProfile) => void;
    onLogout: () => void;
    t: any;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdateProfile, onLogout, t }) => {
    const [formData, setFormData] = useState<UserProfile>(profile);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (field: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile({
            ...formData,
            monthlyIncome: Number(formData.monthlyIncome),
            savingsGoal: Number(formData.savingsGoal)
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in text-[#16310c] max-w-2xl mx-auto">
            <Card title={t.settings.title}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                            <UserCircleIcon className="w-12 h-12 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#16310c]">{t.settings.personalInfo}</h3>
                            <p className="text-sm text-[#16310c]/60">{t.settings.personalInfoDesc}</p>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#16310c]/80 mb-1">{t.settings.displayName}</label>
                            <div className="relative">
                                <UserCircleIcon className={`w-5 h-5 absolute top-2.5 text-slate-400 ${formData.language === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${formData.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#16310c]/80 mb-1">{t.settings.monthlyIncome} ({t.common.sar})</label>
                                <div className="relative">
                                    <BanknotesIcon className={`w-5 h-5 absolute top-2.5 text-slate-400 ${formData.language === 'ar' ? 'right-3' : 'left-3'}`} />
                                    <input 
                                        type="number"
                                        value={formData.monthlyIncome}
                                        onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                                        className={`w-full py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${formData.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#16310c]/80 mb-1">{t.settings.savingsGoal} ({t.common.sar})</label>
                                <div className="relative">
                                    <CurrencyDollarIcon className={`w-5 h-5 absolute top-2.5 text-slate-400 ${formData.language === 'ar' ? 'right-3' : 'left-3'}`} />
                                    <input 
                                        type="number"
                                        value={formData.savingsGoal}
                                        onChange={(e) => handleChange('savingsGoal', e.target.value)}
                                        className={`w-full py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${formData.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#16310c]/80 mb-1">{t.settings.currency}</label>
                                <select 
                                    value={formData.currency}
                                    onChange={(e) => handleChange('currency', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                >
                                    <option value="SAR">Saudi Riyal (SAR)</option>
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#16310c]/80 mb-1">{t.settings.language}</label>
                                <div className="relative">
                                    <LanguageIcon className={`w-5 h-5 absolute top-2.5 text-slate-400 ${formData.language === 'ar' ? 'right-3' : 'left-3'}`} />
                                    <select 
                                        value={formData.language}
                                        onChange={(e) => handleChange('language', e.target.value)}
                                        className={`w-full py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white ${formData.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                                    >
                                        <option value="en">English</option>
                                        <option value="ar">العربية</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             {isSaved && (
                                 <span className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in">
                                     <CheckCircleIcon className="w-4 h-4" /> {t.common.saved}
                                 </span>
                             )}
                         </div>
                         <button 
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                         >
                            {t.common.save}
                         </button>
                    </div>
                </form>
            </Card>

            {/* Logout Zone */}
            <div className="flex justify-center pt-8">
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                    <ArrowRightOnRectangleIcon className={`w-5 h-5 ${formData.language === 'ar' ? 'rotate-180' : ''}`} />
                    {t.settings.signOut}
                </button>
            </div>
        </div>
    );
};