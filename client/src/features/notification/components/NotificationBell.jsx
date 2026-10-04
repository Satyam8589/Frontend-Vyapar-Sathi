"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle2, ShoppingCart, ArrowLeftRight, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import api from "@/servies/api";

const getNotificationIcon = (type) => {
  switch (type) {
    case 'OUT_OF_STOCK':
      return <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />;
    case 'LOW_STOCK':
    case 'REORDER_ALERT':
      return <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />;
    case 'PURCHASE_DUE':
      return <ShoppingCart className="text-blue-500 w-5 h-5 flex-shrink-0" />;
    case 'PURCHASE_CREATED':
    case 'PURCHASE_UPDATED':
      return <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />;
    case 'PURCHASE_RETURNED':
      return <ArrowLeftRight className="text-purple-500 w-5 h-5 flex-shrink-0" />;
    case 'SYSTEM_ERROR':
      return <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0" />;
    default:
      return <Info className="text-slate-500 w-5 h-5 flex-shrink-0" />;
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { storeId } = useParams();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    if (!storeId) return;
    try {
      const res = await api.get(`/notifications/${storeId}/unread-count`);
      if (res.data?.success) {
        setUnreadCount(res.data.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const fetchNotifications = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await api.get(`/notifications/${storeId}?limit=20`);
      if (res.data?.success) {
        setNotifications(res.data.data.notifications);
        // Also update unread count based on fetched items (could be slightly different from unread count endpoint)
        fetchUnreadCount();
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [storeId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${storeId}/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch(`/notifications/${storeId}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead({ stopPropagation: () => {} }, notification._id);
    }

    setIsOpen(false);

    if (['LOW_STOCK', 'OUT_OF_STOCK', 'REORDER_ALERT'].includes(notification.type)) {
      router.push(`/storeDashboard/${storeId}/products`);
    } else if (['PURCHASE_DUE', 'PURCHASE_CREATED', 'PURCHASE_UPDATED'].includes(notification.type)) {
      if (notification.relatedEntityId && notification.relatedEntityId._id) {
        router.push(`/storeDashboard/${storeId}/purchases/${notification.relatedEntityId._id}`);
      } else {
        router.push(`/storeDashboard/${storeId}/purchases`);
      }
    } else if (notification.type === 'PURCHASE_RETURNED') {
      router.push(`/storeDashboard/${storeId}/purchases/returns`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-slate-200 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-slate-50 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                <Bell className="w-8 h-8 text-slate-300 mb-2" />
                No new notifications.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <li 
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex gap-3 p-4 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className={`text-xs ${!notification.isRead ? 'text-slate-700' : 'text-slate-500'} line-clamp-2`}>
                        {notification.message}
                      </p>
                      <div className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800">
                        View details
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0 flex items-center justify-center">
                        <button 
                          onClick={(e) => handleMarkAsRead(e, notification._id)}
                          className="w-2 h-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                          title="Mark as read"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
