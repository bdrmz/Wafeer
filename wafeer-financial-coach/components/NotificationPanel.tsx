import React, { useRef, useEffect } from 'react';
import { Notification } from '../types';
import { 
    XMarkIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    InformationCircleIcon,
    BellAlertIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAllRead: () => void;
    onMarkRead: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
    isOpen, 
    onClose, 
    notifications, 
    onMarkAllRead,
    onMarkRead
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
            case 'alert': return <BellAlertIcon className="w-5 h-5 text-rose-500" />;
            case 'success': return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
            default: return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div 
            ref={panelRef}
            className="absolute top-16 right-4 md:right-20 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#16310c]">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                        <button 
                            onClick={onMarkAllRead}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                            title="Mark all as read"
                        >
                            Mark all read
                        </button>
                    )}
                    <button onClick={onClose} className="p-1 text-[#16310c]/50 hover:bg-slate-200 rounded-lg transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-[#16310c]/50">
                        <BellAlertIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                onClick={() => onMarkRead(notification.id)}
                                className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
                            >
                                <div className="shrink-0 mt-0.5">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-[#16310c]' : 'text-[#16310c]/70'}`}>
                                            {notification.title}
                                        </p>
                                        <span className="text-[10px] text-[#16310c]/40 whitespace-nowrap ml-2">
                                            {notification.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#16310c]/60 leading-relaxed">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <button 
                    onClick={onClose}
                    className="text-xs font-medium text-[#16310c]/60 hover:text-indigo-600 transition-colors"
                >
                    Close Panel
                </button>
            </div>
        </div>
    );
};