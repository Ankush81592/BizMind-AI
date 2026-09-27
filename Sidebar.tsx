import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Bot,
  Sparkles,
  Cpu,
  Sliders,
  GitCompare,
  TrendingUp,
  Wallet,
  Users,
  Briefcase,
  FileSpreadsheet,
  UploadCloud,
  Bell,
  Headphones,
  LifeBuoy,
  ShieldCheck,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { useBusiness, AppPage } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: AppPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentPage, navigateTo, unreadNotifications } = useBusiness();
  const { user, logout } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'Command Center',
      items: [
        { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
        { id: 'business', label: 'Business Overview', icon: Building2 },
      ],
    },
    {
      title: 'AI Intelligence',
      items: [
        { id: 'agents', label: 'AI Multi-Agents', icon: Bot, badge: '10' },
        { id: 'copilot', label: 'Business Copilot', icon: Sparkles },
        { id: 'digital-twin', label: 'Digital Twin', icon: Cpu, badge: '78/100' },
        { id: 'scenarios', label: 'Scenario Simulator', icon: Sliders },
        { id: 'scenarios-compare', label: 'Scenario Comparison', icon: GitCompare },
      ],
    },
    {
      title: 'Business Analytics',
      items: [
        { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
        { id: 'finance', label: 'Finance & Cash Flow', icon: Wallet },
        { id: 'customers', label: 'Customer Analytics', icon: Users },
        { id: 'employees', label: 'Employee Analytics', icon: Briefcase },
      ],
    },
    {
      title: 'Operations & Data',
      items: [
        { id: 'reports', label: 'Business Reports', icon: FileSpreadsheet },
        { id: 'import', label: 'Data Import Center', icon: UploadCloud },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotifications > 0 ? String(unreadNotifications) : undefined,
        },
      ],
    },
    {
      title: 'Support & Help Desk',
      items: [
        { id: 'support', label: 'Support Center', icon: Headphones },
        { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy },
        { id: 'admin', label: 'Admin Support Desk', icon: ShieldCheck, badge: 'Staff' },
      ],
    },
    {
      title: 'Account & Settings',
      items: [
        { id: 'profile', label: 'Profile & Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (pageId: AppPage) => {
    navigateTo(pageId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800 shrink-0">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              BM
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-tight leading-none flex items-center gap-1.5">
                BizMind AI
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded border border-blue-400/30">
                  v1.0
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Business Command Center</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = currentPage === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Roster & Quick Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80 mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-md bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{user?.name || 'Demo User'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || 'demo@bizmind.ai'}</div>
              </div>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigateTo('landing');
              }}
              title="Logout"
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[10px] text-slate-300 text-center flex items-center justify-center gap-1">
            <span>Contact Support:</span>
            <button
              onClick={() => handleNavClick('support')}
              className="text-blue-400 hover:underline font-medium"
            >
              +91 8988542477
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
