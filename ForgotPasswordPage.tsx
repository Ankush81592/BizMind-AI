import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Phone, MessageSquare, AlertCircle, Sun, Moon } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export function ForgotPasswordPage() {
  const { navigateTo } = useBusiness();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.forgotPassword(email);
      setMessage(res.message);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white transition-colors relative">
      {/* Top Controls: Return to Landing & Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        <button
          onClick={() => navigateTo('landing')}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div
          onClick={() => navigateTo('landing')}
          className="flex items-center justify-center gap-2 cursor-pointer mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg">
            BM
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">BizMind AI</span>
        </div>
        <h2 className="text-center text-xl font-bold text-slate-900 dark:text-slate-100">
          Reset your Account Password
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-400">
          Enter your registered business email for instant recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 sm:px-10 transition-colors">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Instructions Dispatched</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                You can also immediately reach our human support team:
                <div className="mt-2 text-slate-900 dark:text-white font-semibold">
                  Phone: <a href="tel:+918988542477" className="text-blue-600 dark:text-blue-400 hover:underline">+91 8988542477</a>
                </div>
              </div>

              <button
                onClick={() => navigateTo('login')}
                className="w-full mt-4 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Registered Email Address</label>
                <div className="mt-1 relative rounded-lg shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {loading ? 'Submitting Request...' : 'Send Recovery Instructions'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
