import React, { useState } from 'react';
import {
  User,
  Building,
  Lock,
  Phone,
  Mail,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export function ProfileSettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { navigateTo } = useBusiness();
  const { theme, setTheme, toggleTheme } = useTheme();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [businessType, setBusinessType] = useState(user?.businessType || 'B2B SaaS & Tech');
  const [currency, setCurrency] = useState(user?.currency || 'INR');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // AI & Notification Preferences
  const [aiAutoInsights, setAiAutoInsights] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [churnAlerts, setChurnAlerts] = useState(true);

  // Status feedback
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    setErrorMsg(null);
    try {
      const res = await api.updateProfile({
        name,
        phone,
        businessName,
        businessType,
        currency,
      });
      updateUser(res.user);
      setProfileMsg('Profile configuration saved successfully.');
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }
    setSaving(true);
    setPasswordMsg(null);
    setErrorMsg(null);
    try {
      const res = await api.changePassword({ currentPassword, newPassword });
      setPasswordMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('CRITICAL WARNING: This will permanently delete your user account and all business records. Type OK to confirm.')) {
      try {
        await api.deleteAccount();
        await logout();
        navigateTo('landing');
      } catch (err: any) {
        alert(err.message || 'Failed to delete account.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Profile & Account Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your interface appearance, personal details, business configurations, authentication, and AI parameters
        </p>
      </div>

      {profileMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{profileMsg}</span>
        </div>
      )}

      {passwordMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{passwordMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interface Theme & Appearance Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>Interface Theme & Display</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize the visual aesthetic of the BizMind AI platform
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
            Active: {theme}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Light Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Crisp high-contrast day theme</div>
              </div>
            </div>
            {theme === 'light' && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">
                ✓
              </span>
            )}
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xs">
                <Moon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Dark Mode</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Sleek midnight command center</div>
              </div>
            </div>
            {theme === 'dark' && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">
                ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile & Business Parameters Form */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Personal & Enterprise Profile</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Default Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* AI & Notification Preferences (Section 21) */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>AI Preferences & Automation Tuning</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Autonomous Daily AI Insights</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Automatically summarize key business shifts and anomalies.</div>
            </div>
            <input
              type="checkbox"
              checked={aiAutoInsights}
              onChange={e => setAiAutoInsights(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">High Churn Risk Alerts</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Notify immediately when accounts display negative telemetry.</div>
            </div>
            <input
              type="checkbox"
              checked={churnAlerts}
              onChange={e => setChurnAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Email Digest Notifications</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Send weekly PDF reports to {user?.email}.</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
          </label>
        </div>
      </div>

      {/* Change Password */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Security & Password Management</span>
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="p-6 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-3 transition-colors">
        <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300">Danger Zone</h3>
        <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
          Permanent actions: logging out or permanently purging your account and business records.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigateTo('landing');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account & Purge Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}
