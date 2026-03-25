import { createContext, useContext, useState, useCallback } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllRead: () => {},
  markRead: () => {},
});

const initialNotifications: Notification[] = [
  { id: "1", title: "Budget Alert", message: "Food & Dining is at 77% of your monthly limit", type: "warning", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "2", title: "Transaction Added", message: "Naivas Supermarket — KES 3,450", type: "success", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "3", title: "Housing Budget", message: "You've spent 87.5% of your housing budget", type: "warning", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "createdAt">) => {
    setNotifications(prev => [
      { ...n, id: crypto.randomUUID(), read: false, createdAt: new Date() },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
