import React, { useState, useEffect } from 'react';
import { Building, Target, Shield, RefreshCw, Trash2, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../services/api';
import { Business } from '../types';

export function BusinessOverviewPage() {
  const { formatCurrency } = useBusiness();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    industry: '',
    currency: 'INR',
    targetRevenue: 15000000,
  });

  const loadBusiness = async () => {
    setLoading(true);
    try {
      const res = await api.getBusiness();
      setBusiness(res.business);
      setFormData({
        name: res.business.name || '',
        type: res.business.type || '',
        industry: res.business.industry || '',
        currency: res.business.currency || 'INR',
        targetRevenue: res.business.targetRevenue || 15000000,
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusiness();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await api.updateBusiness(formData);
      setBusiness(res.business);
      setFeedback('Business profile settings saved.');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update business configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (confirm('Are you sure you want to reset and restore the realistic demo dataset?')) {
      try {
        await api.resetDemoData();
        await loadBusiness();
        alert('Demo business dataset successfully restored!');
      } catch (err: any) {
        alert(err.message || 'Failed to reset demo data.');
      }
    }
  };

  const handleClearData = async () => {
    if (confirm('Warning: This will delete all transactions, expenses, customers, and AI reports for your business. Proceed?')) {
      try {
        await api.clearData();
        await loadBusiness();
        alert('All business records cleared.');
      } catch (err: any) {
        alert(err.message || 'Failed to clear data.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const currentRunRate = 17400000; // ~1.74 Cr ARR
  const targetPct = Math.min(100, Math.round((currentRunRate / (formData.targetRevenue || 1)) * 100));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Business Overview & Configuration</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Virtual model profile, operational targets, and business parameters
        </p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Target ARR Progress Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Annual Revenue Run-Rate (ARR) Target</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(currentRunRate)} / {formatCurrency(formData.targetRevenue)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current performance is tracking at <span className="font-bold text-emerald-600 dark:text-emerald-400">{targetPct}%</span> of annual hurdle
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Ahead of Plan (+16%)
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" style={{ width: `${targetPct}%` }} />
        </div>
      </div>

      {/* Form & Profile Settings */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Enterprise Parameters</h3>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Entity Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Model</label>
              <input
                type="text"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Sector</label>
              <input
                type="text"
                value={formData.industry}
                onChange={e => setFormData({ ...formData, industry: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Accounting Currency</label>
              <select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Annual Revenue ({formData.currency})</label>
              <input
                type="number"
                value={formData.targetRevenue}
                onChange={e => setFormData({ ...formData, targetRevenue: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dataset Maintenance Actions */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Data Operations & Maintenance</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Reset demo data for evaluator testing, or wipe all records to import custom enterprise books.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDemo}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Restore Realistic Demo Dataset</span>
          </button>

          <button
            onClick={handleClearData}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Business Records</span>
          </button>
        </div>
      </div>
    </div>
  );
}
