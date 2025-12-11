import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Transaction, UserProfile, ForecastEvent, Goal } from '../types';
import { Card } from './ui/Card';
import { MiniCalendar } from './MiniCalendar';
import { analyzeFinances } from '../services/geminiService';
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon, 
  BellAlertIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DashboardProps {
  transactions: Transaction[];
  profile: UserProfile;
  events: ForecastEvent[];
  goals?: Goal[];
  t: any;
  children?: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, profile, events, goals = [], t, children }) => {
  const [analysis, setAnalysis] = useState<string>(t.dashboard.analyzing);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showSubAlert, setShowSubAlert] = useState(true);

  useEffect(() => {
    if (analysis === "Analyzing your financial health..." || analysis === "جاري تحليل صحتك المالية...") {
        setAnalysis(t.dashboard.analyzing);
    }
  }, [t, analysis]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingAnalysis(true);
      const result = await analyzeFinances(transactions, profile, events);
      setAnalysis(result);
      setLoadingAnalysis(false);
    };
    fetchAnalysis();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate totals
  const currentMonthSpending = transactions
    .filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = profile.monthlyIncome - currentMonthSpending;
  const subscriptionCount = transactions.filter(t => t.isSubscription).length;

  // Prepare chart data (Last 30 days daily spend)
  const chartData = React.useMemo(() => {
    const data: any[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dailyTotal = transactions
        .filter(t => t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      data.push({ name: d.getDate().toString(), amount: dailyTotal });
    }
    return data;
  }, [transactions]);

  return (
    <div className="space-y-6 animate-fade-in text-[#16310c]">

      {/* Subscription Alert Banner */}
      {showSubAlert && subscriptionCount > 5 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start justify-between shadow-sm">
            <div className="flex gap-4">
                <div className="bg-orange-100 p-2 rounded-lg h-fit shrink-0">
                    <BellAlertIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-red-800">{t.dashboard.alertTitle}</h4>
                    <p className="text-sm text-red-700 mt-1 max-w-3xl">
                        {t.dashboard.alertMsg.replace('{count}', subscriptionCount.toString())}
                    </p>
                </div>
            </div>
            <button 
                onClick={() => setShowSubAlert(false)} 
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
      )}

      {/* Top Stats Row - Grid for phone, Flex for Desktop */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Safe to Spend */}
        <Card className="!p-3 md:!p-6 border-l-2 md:border-l-4 border-l-blue-500 rtl:border-l-0 rtl:border-r-2 md:rtl:border-r-4 rtl:border-r-blue-500 flex flex-col justify-between h-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-1 md:gap-0">
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] md:text-sm font-medium text-[#16310c]/70 truncate leading-tight">{t.dashboard.safeToSpend}</p>
              <h2 className="text-sm md:text-2xl font-bold text-[#16310c] mt-0.5 md:mt-0 truncate">
                <span className="text-[10px] md:text-lg align-top mr-0.5 font-normal opacity-70">{t.common.sar}</span>
                {remainingBudget.toLocaleString()}
              </h2>
            </div>
            <BanknotesIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-500 shrink-0 self-start md:self-auto hidden sm:block md:block" />
          </div>
          <p className="text-[10px] text-[#16310c]/60 mt-1 hidden md:block truncate">{t.dashboard.remaining}</p>
        </Card>

        {/* Savings Rate */}
        <Card className="!p-3 md:!p-6 border-l-2 md:border-l-4 border-l-green-500 rtl:border-l-0 rtl:border-r-2 md:rtl:border-r-4 rtl:border-r-green-500 flex flex-col justify-between h-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-1 md:gap-0">
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] md:text-sm font-medium text-[#16310c]/70 truncate leading-tight">{t.dashboard.savingsRate}</p>
              <h2 className="text-sm md:text-2xl font-bold text-[#16310c] mt-0.5 md:mt-0 truncate">12%</h2>
            </div>
            <ArrowTrendingUpIcon className={`h-5 w-5 md:h-6 md:w-6 text-green-500 shrink-0 self-start md:self-auto hidden sm:block md:block ${profile.language === 'ar' ? 'transform -scale-x-100' : ''}`} />
          </div>
          <p className="text-[10px] text-green-600 mt-1 hidden md:block truncate">+2% {t.dashboard.vsLastMonth}</p>
        </Card>

        {/* Active Subs */}
        <Card className="!p-3 md:!p-6 border-l-2 md:border-l-4 border-l-purple-500 rtl:border-l-0 rtl:border-r-2 md:rtl:border-r-4 rtl:border-r-purple-500 flex flex-col justify-between h-full">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-1 md:gap-0">
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] md:text-sm font-medium text-[#16310c]/70 truncate leading-tight">{t.dashboard.activeSubs}</p>
              <h2 className="text-sm md:text-2xl font-bold text-[#16310c] mt-0.5 md:mt-0 truncate">
                {subscriptionCount}
              </h2>
            </div>
            <BellAlertIcon className="h-5 w-5 md:h-6 md:w-6 text-red-500 shrink-0 self-start md:self-auto hidden sm:block md:block" />
          </div>
          <p className="text-[10px] text-[#16310c]/60 mt-1 hidden md:block truncate">{t.dashboard.checkFees}</p>
        </Card>
      </div>

      {/* Calendar + Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Reduced height from h-96 to h-64 */}
          <Card title={t.dashboard.cashFlow} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} width={45} orientation={profile.language === 'ar' ? 'right' : 'left'} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: profile.language === 'ar' ? 'right' : 'left' }}
                  formatter={(value: number) => [`${t.common.sar} ${value.toLocaleString()}`, 'Spent']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: '#3b82f6' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="lg:col-span-1 h-full">
          <MiniCalendar events={events} goals={goals} />
        </div>
      </div>

      {/* Bottom Row: Goals (Children) & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
           {children}
        </div>

        <div className="h-full">
          <Card title={t.dashboard.insights} className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 pl-2">
              {loadingAnalysis ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="prose prose-sm text-[#16310c]/80">
                  <div className="whitespace-pre-line leading-relaxed">
                    {analysis}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#16310c]/60 mb-2">{t.dashboard.upcomingImpact}</h4>
               {events.map((event, idx) => (
                 <div key={idx} className="mb-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-indigo-900 text-sm">{event.name}</span>
                      <span className="text-xs text-indigo-600 bg-indigo-200 px-2 py-0.5 rounded-full">{event.daysUntil} {t.dashboard.daysLeft}</span>
                    </div>
                    <p className="text-xs text-indigo-800">{event.recommendation}</p>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};