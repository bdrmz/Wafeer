import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ForecastEvent, Goal } from '../types';

interface MiniCalendarProps {
  events: ForecastEvent[];
  goals?: Goal[];
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ events, goals = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Check if a date has an event or goal
  const getItemsForDate = (day: number) => {
    const dateStr = new Date(year, month, day + 1).toISOString().split('T')[0];
    const dayEvents = events.filter(e => e.date === dateStr);
    const dayGoals = goals.filter(g => g.deadline === dateStr);
    return { events: dayEvents, goals: dayGoals };
  };

  const renderDays = () => {
    const daysArray = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`pad-${i}`} className="h-8"></div>);
    }
    
    // Days
    for (let i = 1; i <= days; i++) {
      const { events: dayEvents, goals: dayGoals } = getItemsForDate(i);
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();
      const hasEvent = dayEvents.length > 0;
      const hasGoal = dayGoals.length > 0;
      
      daysArray.push(
        <div key={i} className="h-8 flex flex-col items-center justify-center relative group cursor-default">
          <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-[#16310c]'} ${(hasEvent || hasGoal) ? 'font-bold' : ''}`}>
            {i}
          </span>
          <div className="absolute bottom-0 flex gap-0.5 justify-center">
             {hasEvent && <div className="w-1 h-1 bg-red-500 rounded-full"></div>}
             {hasGoal && <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>}
          </div>
          
          {/* Tooltip */}
          {(hasEvent || hasGoal) && (
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 w-max max-w-[180px] bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg">
              {dayEvents.map((e, idx) => (
                  <div key={`e-${idx}`} className="mb-1">
                     <p className="font-semibold text-red-300 truncate">{e.name}</p>
                     <p>SAR {e.estimatedCost}</p>
                  </div>
              ))}
              {dayGoals.map((g, idx) => (
                  <div key={`g-${idx}`} className={dayEvents.length > 0 ? 'mt-1 pt-1 border-t border-slate-600' : ''}>
                     <p className="font-semibold text-emerald-300 truncate">{g.name}</p>
                     <p>Goal Target</p>
                  </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return daysArray;
  };

  const relevantEvents = events.filter(e => {
      const eDate = new Date(e.date);
      return eDate.getMonth() === month && eDate.getFullYear() === year;
  });

  const relevantGoals = goals.filter(g => {
      if (!g.deadline) return false;
      const gDate = new Date(g.deadline);
      return gDate.getMonth() === month && gDate.getFullYear() === year;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#16310c]">{monthNames[month]} {year}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded text-[#16310c]/60">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded text-[#16310c]/60">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-[#16310c]/50">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-1">
        {renderDays()}
      </div>
      
      {/* Legend / Upcoming list short */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
         {relevantEvents.length === 0 && relevantGoals.length === 0 ? (
            <p className="text-xs text-[#16310c]/50 text-center py-1">No major events or goals this month</p>
         ) : (
            <>
                {relevantEvents.map((e, idx) => (
                    <div key={`e-list-${idx}`} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span className="text-[#16310c]/80 truncate flex-1">{e.name}</span>
                        <span className="text-[#16310c]/50">{new Date(e.date).getDate()}th</span>
                    </div>
                ))}
                {relevantGoals.map((g, idx) => (
                    <div key={`g-list-${idx}`} className="flex items-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span className="text-[#16310c]/80 truncate flex-1">{g.name}</span>
                        <span className="text-[#16310c]/50">{new Date(g.deadline!).getDate()}th</span>
                    </div>
                ))}
            </>
         )}
      </div>
    </div>
  );
};