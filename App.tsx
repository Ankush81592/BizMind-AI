import { AuthProvider, useAuth } from './context/AuthContext';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { BusinessOverviewPage } from './pages/BusinessOverviewPage';
import { AIAgentsPage } from './pages/AIAgentsPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage';
import { ScenarioComparisonPage } from './pages/ScenarioComparisonPage';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { FinanceAnalyticsPage } from './pages/FinanceAnalyticsPage';
import { CustomerAnalyticsPage } from './pages/CustomerAnalyticsPage';
import { EmployeeAnalyticsPage } from './pages/EmployeeAnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataImportPage } from './pages/DataImportPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SupportCenterPage } from './pages/SupportCenterPage';
import { SupportTicketsPage } from './pages/SupportTicketsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentPage, navigateTo } = useBusiness();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-base shadow-lg animate-pulse mb-3">
          BM
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          <span>Starting BizMind AI Command Center...</span>
        </div>
      </div>
    );
  }

  // Public Unauthenticated Pages
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'login') {
    return <LoginPage />;
  }

  if (currentPage === 'register') {
    return <RegisterPage />;
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage />;
  }

  // If user is not logged in and attempts to access protected dashboard routes,
  // route them to the Login page with seamless access
  if (!user) {
    return <LoginPage />;
  }

  // Render Protected Dashboard Pages inside AppLayout
  const renderDashboardPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'business':
        return <BusinessOverviewPage />;
      case 'agents':
        return <AIAgentsPage />;
      case 'copilot':
        return <AICopilotPage />;
      case 'digital-twin':
        return <DigitalTwinPage />;
      case 'scenarios':
        return <ScenarioSimulatorPage />;
      case 'scenarios-compare':
        return <ScenarioComparisonPage />;
      case 'sales':
        return <SalesAnalyticsPage />;
      case 'finance':
        return <FinanceAnalyticsPage />;
      case 'customers':
        return <CustomerAnalyticsPage />;
      case 'employees':
        return <EmployeeAnalyticsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'import':
        return <DataImportPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'support':
        return <SupportCenterPage />;
      case 'tickets':
        return <SupportTicketsPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'profile':
        return <ProfileSettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppLayout>{renderDashboardPage()}</AppLayout>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BusinessProvider>
          <AppContent />
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
