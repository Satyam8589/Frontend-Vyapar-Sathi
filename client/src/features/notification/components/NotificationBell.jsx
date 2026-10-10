"use client";

import { useState, useEffect, useRef } from "react";
import * as PusherPushNotifications from '@pusher/push-notifications-web';
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
    case 'SALE_CREATED':
      return <ShoppingCart className="text-emerald-500 w-5 h-5 flex-shrink-0" />;
    case 'GRN_CREATED':
      return <CheckCircle2 className="text-indigo-500 w-5 h-5 flex-shrink-0" />;
    case 'PAYMENT_RECEIVED':
      return <CheckCircle2 className="text-teal-500 w-5 h-5 flex-shrink-0" />;
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
  const [showPushModal, setShowPushModal] = useState(false);
  const { storeId } = useParams();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    if (!storeId) return;
    try {
      const res = await api.get(`/notifications/${storeId}/unread-count`);
      const count = res.data?.data?.count ?? res.data?.count;
      if (count !== undefined) {
        setUnreadCount(count);
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
      const list = res.data?.data?.notifications || res.data?.notifications || (Array.isArray(res.data?.data) ? res.data.data : null);
      if (list) {
        setNotifications(list);
        fetchUnreadCount();
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if notifications are already allowed, auto-register Pusher Beams
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        enablePushNotifications();
      } else if (Notification.permission === 'default') {
        const pref = localStorage.getItem('pushNotificationPreference');
        if (pref !== 'disabled') {
          setTimeout(() => setShowPushModal(true), 1500);
        }
      }
    }
  }, [storeId]);

  const enablePushNotifications = async () => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        let perm = Notification.permission;
        
        // Explicitly request permission first to ensure the browser prompt appears
        if (perm === 'default') {
          perm = await Notification.requestPermission();
        }
        
        if (perm === 'denied') {
          alert("Your browser is blocking notifications. Please click the lock icon next to your URL bar, change Notifications to 'Allow', and refresh the page.");
          setShowPushModal(false);
          return;
        }
      }

      setShowPushModal(false);
      localStorage.setItem('pushNotificationPreference', 'enabled');
      
      const registration = await navigator.serviceWorker.ready;
      const BeamsClient = PusherPushNotifications.Client || (typeof window !== "undefined" ? window.PusherPushNotifications?.Client : null);
      if (!BeamsClient) {
        throw new Error("Pusher Beams SDK is not loaded");
      }
      const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID || 'be4228c4-3829-4723-a544-2cbdbee5493d';
      const beamsClient = new BeamsClient({
        instanceId,
        serviceWorkerRegistration: registration,
      });
      
      await beamsClient.start();
      const interests = ['hello'];
      if (storeId) {
        interests.push(`store-${storeId}`);
      }
      await beamsClient.setDeviceInterests(interests);
      console.log('[Pusher Beams] Registered and subscribed to interests:', interests);
    } catch (e) {
      console.error('Pusher Beams initialization error:', e);
      alert('Error enabling notifications: ' + e.message + '\n\nPlease ensure notifications are allowed in your browser settings (Lock icon next to URL).');
      // Revert preference if it failed so they can try again later
      localStorage.removeItem('pushNotificationPreference');
    }
  };

  const declinePushNotifications = () => {
    localStorage.setItem('pushNotificationPreference', 'disabled');
    setShowPushModal(false);
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll every minute as fallback
    const interval = setInterval(fetchUnreadCount, 60000);

    // Initialize WebSocket for real-time notifications
    let ws;
    let reconnectTimer;
    let isMounted = true;

    const connectWebSocket = () => {
      if (!isMounted || !storeId) return;

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const wsOrigin = new URL(apiUrl).origin.replace(/^http/, 'ws');
        const wsUrl = `${wsOrigin}/api/ws/notifications?token=${encodeURIComponent(token)}&storeId=${storeId}`;
        
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log("[WebSocket] Connected for real-time notifications");
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "NEW_NOTIFICATION" && data.data) {
              setNotifications(prev => [data.data, ...prev]);
              setUnreadCount(prev => prev + 1);
            }
          } catch (err) {
            console.warn("[WebSocket] Could not parse incoming message", err);
          }
        };

        ws.onerror = (err) => {
          // Log as info/warn to prevent Next.js Turbopack dev error boundary
          console.warn("[WebSocket] Notification channel unavailable, polling active.");
        };

        ws.onclose = (e) => {
          console.log("[WebSocket] Disconnected (code:", e.code, ")");
          if (isMounted && e.code !== 1000 && e.code !== 4001) {
            reconnectTimer = setTimeout(connectWebSocket, 5000);
          }
        };
      } catch (err) {
        console.warn("[WebSocket] Init failed:", err.message);
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.close(1000, "Component unmounted");
      }
    };
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

      {/* Push Notifications Permission Modal */}
      {showPushModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 m-4 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={declinePushNotifications}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-5 ring-8 ring-blue-50/50">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Enable Notifications</h3>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Stay updated with important alerts about low stock and purchase orders even when you're away.
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={declinePushNotifications}
                  className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Not Now
                </button>
                <button 
                  onClick={enablePushNotifications}
                  className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
