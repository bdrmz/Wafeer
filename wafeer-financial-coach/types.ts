export interface Transaction {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  category: string;
  isSubscription?: boolean;
}

export type ObligationType = 'Family' | 'Loan' | 'Installment' | 'Other';

export interface FinancialObligation {
  id: string;
  type: ObligationType;
  name: string; // e.g. "Family Member 1", "Car Loan"
  amount: number;
  dayOfMonth: number; // 1-31
  endYear?: number; // For loans/installments
}

export interface UserProfile {
  name: string;
  monthlyIncome: number;
  monthlyBudget?: number;
  currency: string;
  savingsGoal: number;
  language: 'en' | 'ar';
  obligations?: FinancialObligation[];
  interestedEvents?: string[];
}

export interface SpendingCategory {
  name: string;
  amount: number;
  color: string;
}

export interface ForecastEvent {
  name: string;
  date: string;
  estimatedCost: number;
  daysUntil: number;
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface PaymentCard {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Mada';
  last4: string;
  expiry: string;
  holder: string;
  color: string;
  balance?: number;
  isDefault: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  isRead: boolean;
}

export interface Goal {
    id: string;
    name: string;
    current: number;
    target: number;
    color: string;
    deadline?: string;
    recurring?: {
        amount: number;
        frequency: 'Weekly' | 'Monthly';
    }
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  WALLET = 'WALLET',
  GOALS = 'GOALS',
  CALCULATOR = 'CALCULATOR',
  COACH = 'COACH',
  SETTINGS = 'SETTINGS'
}