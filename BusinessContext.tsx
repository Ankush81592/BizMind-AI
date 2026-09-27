import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

export type AppPage =
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'business'
  | 'agents'
  | 'copilot'
  | 'digital-twin'
  | 'scenarios'
  | 'scenarios-compare'
  | 'sales'
  | 'finance'
  | 'customers'
  | 'employees'
  | 'reports'
  | 'import'
  | 'notifications'
  | 'support'
  | 'tickets'
  | 'admin'
  | 'profile';

interface BusinessContextType {
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
  unreadNotifications: number;
  refreshNotificationsCount: () => Promise<void>;
  formatCurrency: (amount: number, currency?: string) => string;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activeTicketId: string | null;
  setActiveTicketId: (id: string | null) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const refreshNotificationsCount = async () => {
    try {
      const res = await api.getNotifications();
      setUnreadNotifications(res.unreadCount || 0);
    } catch {
      // not logged in or network
    }
  };

  useEffect(() => {
    refreshNotificationsCount();
  }, [currentPage]);

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCurrency = (amount: number, currency = 'INR'): string => {
    if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
    if (currency === 'INR') {
      return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    }
    if (currency === 'USD') {
      return `$${Math.round(amount).toLocaleString('en-US')}`;
    }
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  };

  return (
    <BusinessContext.Provider
      value={{
        currentPage,
        navigateTo,
        unreadNotifications,
        refreshNotificationsCount,
        formatCurrency,
        isSearchOpen,
        setIsSearchOpen,
        activeTicketId,
        setActiveTicketId,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
