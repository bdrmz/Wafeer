import { Transaction, UserProfile, ForecastEvent } from './types';

export const USER_PROFILE: UserProfile = {
  name: "Amir",
  monthlyIncome: 20000,
  monthlyBudget: 15000,
  currency: "SAR",
  savingsGoal: 40000,
  language: 'en'
};

// Generate realistic mock data
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories = ['Groceries', 'Dining', 'Shopping', 'Utilities', 'Entertainment', 'Transport'];
  const merchants = {
    'Groceries': ['Danube', 'Tamimi Markets', 'Carrefour', 'Lulu Hypermarket'],
    'Dining': ['HungerStation', 'Al Baik', 'Starbucks', 'Maestro Pizza'],
    'Shopping': ['Amazon SA', 'Jarir Bookstore', 'Extra', 'Namshi'],
    'Utilities': ['SEC', 'NWC', 'STC', 'Mobily'],
    'Entertainment': ['Netflix', 'Spotify', 'VOX Cinemas', 'Steam'],
    'Transport': ['Petromin', 'Uber', 'Riyadh Metro', 'Careem']
  };

  const today = new Date();
  
  // Add some recurring subscriptions (Scaled to SAR)
  const subs = [
    { name: 'Netflix', amount: 45.00 },
    { name: 'Spotify', amount: 20.00 },
    { name: 'Adobe Creative Cloud', amount: 205.00 },
    { name: 'Amazon Prime', amount: 16.00 },
    { name: 'Fitness Time', amount: 450.00 },
    { name: 'OSN+', amount: 35.00 }
  ];

  subs.forEach((sub, index) => {
    transactions.push({
      id: `sub-${index}`,
      date: new Date(today.getFullYear(), today.getMonth(), (index % 28) + 1).toISOString().split('T')[0],
      amount: sub.amount,
      merchant: sub.name,
      category: 'Entertainment',
      isSubscription: true
    });
  });

  // Random transactions for the last 60 days
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchantList = merchants[category as keyof typeof merchants];
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    let amount = 0;
    // Scaled ranges for SAR
    if (category === 'Groceries') amount = 150 + Math.random() * 600;
    else if (category === 'Dining') amount = 30 + Math.random() * 250;
    else if (category === 'Shopping') amount = 100 + Math.random() * 800;
    else if (category === 'Utilities') amount = 200 + Math.random() * 400;
    else amount = 20 + Math.random() * 150;

    transactions.push({
      id: `tx-${i}`,
      date: date.toISOString().split('T')[0],
      amount: parseFloat(amount.toFixed(2)),
      merchant,
      category
    });
  }

  // Sort by date desc
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_TRANSACTIONS = generateTransactions();

// Dynamic dates for better demo experience
const today = new Date();
const date1 = new Date(today);
date1.setDate(today.getDate() + 25);
const date2 = new Date(today);
date2.setDate(today.getDate() + 55);

export const UPCOMING_EVENTS: ForecastEvent[] = [
  {
    name: "Ramadan Prep",
    date: date1.toISOString().split('T')[0],
    estimatedCost: 3000,
    daysUntil: 25,
    recommendation: "Increase grocery budget by 30% for bulk buying. Start saving SAR 120/day."
  },
  {
    name: "Eid al-Fitr Gifts",
    date: date2.toISOString().split('T')[0],
    estimatedCost: 4500,
    daysUntil: 55,
    recommendation: "Set aside SAR 750/week. Look for early discounts on gifts at Jarir or Extra."
  }
];