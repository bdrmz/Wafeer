import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ChatMessage, Transaction, UserProfile, ForecastEvent } from '../types';
import { chatWithCoach } from '../services/geminiService';

interface ChatCoachProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  profile: UserProfile;
  events: ForecastEvent[];
} 

export const ChatCoach: React.FC<ChatCoachProps> = ({ isOpen, onClose, transactions, profile, events }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hi ${profile.name}! I'm Wafeer. I noticed ${events[0].name} is coming up in ${events[0].daysUntil} days. Want to review your budget for it?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare history for API
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    // Call API
    const responseText = await chatWithCoach(userMsg.text, history, { transactions, profile, events });

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Wafeer Coach</h3>
            <p className="text-xs text-slate-300">Online • Event Aware</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your spending..."
            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-full transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};