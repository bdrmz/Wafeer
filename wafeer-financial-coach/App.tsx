import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ChatCoach } from './components/ChatCoach';
import { TransactionsList } from './components/TransactionsList';
import { GoalNavigator } from './components/GoalNavigator';
import { WalletView } from './components/WalletView';
import { SmartCalculator } from './components/SmartCalculator';
import { AuthScreen } from './components/AuthScreen';
import { ProfileSettings } from './components/ProfileSettings';
import { NotificationPanel } from './components/NotificationPanel';
import { MOCK_TRANSACTIONS, USER_PROFILE, UPCOMING_EVENTS } from './constants';
import { AppView, Transaction, UserProfile, Notification, Goal } from './types';
import { translations } from './translations';
import { 
  HomeIcon, 
  CreditCardIcon, 
  SparklesIcon,
  UserCircleIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  WalletIcon,
  TrophyIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid';

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Spending Alert',
        message: 'You have exceeded 80% of your Dining budget for this month.',
        type: 'warning',
        timestamp: '2m ago',
        isRead: false
    },
    {
        id: '2',
        title: 'Upcoming Bill',
        message: 'Your STC internet bill (SAR 250) is due in 3 days.',
        type: 'alert',
        timestamp: '1h ago',
        isRead: false
    },
    {
        id: '3',
        title: 'Goal Milestone',
        message: 'Congratulations! You reached 25% of your Emergency Fund goal.',
        type: 'success',
        timestamp: '1d ago',
        isRead: true
    },
    {
        id: '4',
        title: 'Ramadan Prep',
        message: 'Tip: Start bulk buying non-perishables now to save ~15%.',
        type: 'info',
        timestamp: '2d ago',
        isRead: true
    }
];

const INITIAL_GOALS: Goal[] = [
    { 
        id: '1', 
        name: 'Ramadan Prep', 
        current: 2000, 
        target: 3000, 
        color: 'from-emerald-400 to-emerald-600',
        recurring: { amount: 120, frequency: 'Weekly' },
        deadline: '2025-02-28'
    },
    { 
        id: '2', 
        name: 'Emergency Fund', 
        current: 12500, 
        target: 40000, 
        color: 'from-red-400 to-red-600',
        recurring: { amount: 1000, frequency: 'Monthly' }
    },
    { 
        id: '3', 
        name: 'Eid al-Fitr Gifts', 
        current: 600, 
        target: 4500, 
        color: 'from-blue-400 to-blue-600',
        deadline: '2025-03-30'
    }
];

function App() {
  // Auth & User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(USER_PROFILE);
  
  // App View State
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Language derived from profile
  const lang = userProfile.language;
  const t = translations[lang];

  // Update document direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Handlers
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsChatOpen(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  // Notification Handlers
  const toggleNotifications = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsNotificationsOpen(!isNotificationsOpen);
  };

  const markAllNotificationsRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // If not logged in, show Auth Screen
  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-[#16310c] font-sans selection:bg-indigo-100 pb-24 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm relative">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-indigo-200 shadow-md">
              <span className="font-bold text-lg text-white">W</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#16310c]">Wafeer</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className={`w-5 h-5 absolute top-1/2 -translate-y-1/2 text-[#16310c]/40 ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
            <input 
              type="text" 
              placeholder={t.common.search}
              className={`py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 lg:w-64 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          
          <div className="relative">
              <button 
                onClick={toggleNotifications}
                className={`relative p-2 rounded-full transition-colors ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-[#16310c]/70'}`}
              >
                <BellAlertIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className={`absolute top-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ${lang === 'ar' ? 'left-2' : 'right-2'}`}></span>
                )}
              </button>

              {/* Notification Panel */}
              <NotificationPanel 
                  isOpen={isNotificationsOpen} 
                  onClose={() => setIsNotificationsOpen(false)}
                  notifications={notifications}
                  onMarkAllRead={markAllNotificationsRead}
                  onMarkRead={markNotificationRead}
              />
          </div>

          <button 
            onClick={() => setCurrentView(AppView.SETTINGS)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentView === AppView.SETTINGS ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500 ring-offset-2' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
              <UserCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#16310c]">
                {currentView === AppView.DASHBOARD ? t.titles.dashboard : 
                currentView === AppView.TRANSACTIONS ? t.titles.transactions : 
                currentView === AppView.WALLET ? t.titles.wallet : 
                currentView === AppView.GOALS ? t.titles.goals : 
                currentView === AppView.CALCULATOR ? t.titles.calculator : 
                currentView === AppView.SETTINGS ? t.titles.settings : t.titles.coach}
            </h2>
            <p className="text-[#16310c]/60 text-sm">{t.common.welcome}, {userProfile.name}</p>
        </div>

        {currentView === AppView.DASHBOARD && (
          <div className="space-y-6">
            <Dashboard 
              transactions={transactions}
              profile={userProfile}
              events={UPCOMING_EVENTS}
              goals={goals}
              t={t}
            >
              <GoalNavigator goals={goals} onUpdateGoals={setGoals} t={t} />
            </Dashboard>
            {/* Recent Activity Snippet */}
            <TransactionsList 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction} 
              t={t} 
              isSnippet={true}
              onViewAll={() => setCurrentView(AppView.WALLET)}
            />
          </div>
        )}

        {currentView === AppView.WALLET && (
          <WalletView 
            profile={userProfile} 
            events={UPCOMING_EVENTS} 
            t={t} 
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {currentView === AppView.GOALS && (
            <div className="max-w-4xl mx-auto">
              <GoalNavigator goals={goals} onUpdateGoals={setGoals} t={t} />
            </div>
        )}

        {currentView === AppView.CALCULATOR && (
            <SmartCalculator events={UPCOMING_EVENTS} onViewGoals={() => setCurrentView(AppView.GOALS)} t={t} />
        )}

        {currentView === AppView.SETTINGS && (
            <ProfileSettings 
                profile={userProfile} 
                onUpdateProfile={handleUpdateProfile} 
                onLogout={handleLogout}
                t={t}
            />
        )}
      </main>

      {/* Bottom Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center px-6 py-3 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentView(AppView.DASHBOARD)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.DASHBOARD ? 'text-indigo-600' : 'text-[#16310c]/40 hover:text-[#16310c]/60'}`}
        >
          <HomeIcon className={`w-6 h-6 ${currentView === AppView.DASHBOARD ? 'stroke-2' : ''}`} />
          <span className="text-[10px] font-medium">{t.nav.home}</span>
        </button>
        
        <button 
          onClick={() => setCurrentView(AppView.GOALS)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.GOALS ? 'text-indigo-600' : 'text-[#16310c]/40 hover:text-[#16310c]/60'}`}
        >
          <TrophyIcon className={`w-6 h-6 ${currentView === AppView.GOALS ? 'stroke-2' : ''}`} />
          <span className="text-[10px] font-medium">{t.nav.goals}</span>
        </button>

        {/* Center "Ask" Button */}
        <div className="relative -top-6">
             <button 
                onClick={toggleChat}
                className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 border-4 border-slate-50"
             >
                <SparklesSolid className="w-7 h-7" />
             </button>
        </div>

        <button 
          onClick={() => setCurrentView(AppView.WALLET)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.WALLET ? 'text-indigo-600' : 'text-[#16310c]/40 hover:text-[#16310c]/60'}`}
        >
          <WalletIcon className={`w-6 h-6 ${currentView === AppView.WALLET ? 'stroke-2' : ''}`} />
          <span className="text-[10px] font-medium">{t.nav.wallet}</span>
        </button>

        <button 
          onClick={() => setCurrentView(AppView.CALCULATOR)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.CALCULATOR ? 'text-indigo-600' : 'text-[#16310c]/40 hover:text-[#16310c]/60'}`}
        >
          <CalculatorIcon className={`w-6 h-6 ${currentView === AppView.CALCULATOR ? 'stroke-2' : ''}`} />
          <span className="text-[10px] font-medium">{t.nav.calculator}</span>
        </button>
      </nav>

      {/* Chat Interface */}
      <ChatCoach 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        transactions={transactions}
        profile={userProfile}
        events={UPCOMING_EVENTS}
      />

    </div>
  );
}

export default App;