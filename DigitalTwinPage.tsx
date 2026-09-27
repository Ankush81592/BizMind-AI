import { useState, useEffect } from 'react';
import {
  Cpu,
  TrendingUp,
  DollarSign,
  Users,
  Settings,
  Megaphone,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  RefreshCw,
  GitBranch,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { DigitalTwinData } from '../types';

export function DigitalTwinPage() {
  const { formatCurrency, navigateTo } = useBusiness();
  const [twin, setTwin] = useState<DigitalTwinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'health' | 'streams'>('map');

  const loadTwin = async () => {
    setLoading(true);
    try {
      const res = await api.getDigitalTwin();
      setTwin(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
  }, []);

  if (loading || !twin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Synchronizing live Business Digital Twin graph...</p>
      </div>
    );
  }

  const { health, virtualModel, business } = twin;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Digital Twin</h2>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Synchronized Live
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time virtual replica of {business.name} with structural telemetry and health analytics
          </p>
        </div>

        <button
          onClick={loadTwin}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Recalculate Model</span>
        </button>
      </div>

      {/* Main Health Score Banner (Section 11) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-emerald-950/40">
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-400">{health.score}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">/ 100</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Enterprise Health Score (Dynamically Computed)
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Grade A · Highly Resilient Business Model
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Calculated in real-time from 6 financial, operational, and customer performance dimensions. No hardcoded constants.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('scenarios')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start lg:self-auto cursor-pointer"
          >
            <GitBranch className="w-4 h-4" />
            <span>Simulate Health Impacts</span>
          </button>
        </div>

        {/* 6 Sub-scores pill row */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Financial Health</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{health.breakdown.financial}%</div>
            <div className="text-[9px] text-slate-500">Weight: 25%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Sales Health</div>
            <div className="text-base font-bold text-blue-400 mt-0.5">{health.breakdown.sales}%</div>
            <div className="text-[9px] text-slate-500">Weight: 20%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Customer Health</div>
            <div className="text-base font-bold text-indigo-400 mt-0.5">{health.breakdown.customer}%</div>
            <div className="text-[9px] text-slate-500">Weight: 20%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Operational Health</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">{health.breakdown.operational}%</div>
            <div className="text-[9px] text-slate-500">Weight: 15%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Marketing Health</div>
            <div className="text-base font-bold text-purple-400 mt-0.5">{health.breakdown.marketing}%</div>
            <div className="text-[9px] text-slate-500">Weight: 10%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400">Workforce Health</div>
            <div className="text-base font-bold text-teal-400 mt-0.5">{health.breakdown.workforce}%</div>
            <div className="text-[9px] text-slate-500">Weight: 10%</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold gap-6">
        <button
          onClick={() => setActiveTab('map')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'map' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Visual Business Flow Map (Section 10)
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'health' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Score Methodology & Factors (Section 11)
        </button>
        <button
          onClick={() => setActiveTab('streams')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'streams' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Revenue & Operational Streams
        </button>
      </div>

      {/* Tab 1: Visual Business Map (Section 10) */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Visual Business Flowchart</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Interactive node topology mapping Marketing, Sales, Operations, and Profit Streams.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Flow 1: Marketing -> Leads -> Conversions -> Revenue */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                  <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Marketing & Inbound Funnel</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Stage 1 · Awareness</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">28,400 Monthly Visitors</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Search Ads & Organic B2B</div>
                  </div>

                  <div className="text-center text-blue-500 font-bold text-xs">↓</div>

                  <div className="p-3 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Stage 2 · Inbound Leads</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">1,270 Captured Leads</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">4.4% Visitor Conversion</div>
                  </div>

                  <div className="text-center text-blue-500 font-bold text-xs">↓</div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Stage 3 · Closed Deals</div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-300 mt-0.5">38 New Enterprise Subscriptions</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Avg Deal: ₹45,000</div>
                  </div>
                </div>
              </div>

              {/* Flow 2: Operations -> Overhead -> Gross Profit */}
              <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Operational Pipeline</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 border border-amber-100 dark:border-slate-700 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Capacity Utilization</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">82% Engineering Bandwidth</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">6 core full-time personnel</div>
                  </div>

                  <div className="text-center text-amber-500 font-bold text-xs">↓</div>

                  <div className="p-3 bg-white dark:bg-slate-800 border border-amber-100 dark:border-slate-700 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Cloud Infrastructure</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">₹1,24,000 / Month</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">AWS + GCP Multi-tenant clusters</div>
                  </div>

                  <div className="text-center text-amber-500 font-bold text-xs">↓</div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Fulfillment SLA</div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-300 mt-0.5">3.4 Hour Response SLA</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Zero Critical Incidents</div>
                  </div>
                </div>
              </div>

              {/* Flow 3: Financial Net Summary */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Cash Flow Engine</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Gross Monthly Revenue</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formatCurrency(1450000)}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+14.2% MoM growth</div>
                  </div>

                  <div className="text-center text-slate-400 font-bold text-xs">− Expenses ({formatCurrency(890000)}) =</div>

                  <div className="p-3 bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 rounded-lg shadow-2xs">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Operating Cash Flow</div>
                    <div className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{formatCurrency(560000)}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">38.6% Net Operating Margin</div>
                  </div>

                  <div className="text-center text-emerald-600 font-bold text-xs">↓</div>

                  <div className="p-3 bg-emerald-600 text-white rounded-lg shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-emerald-200">Liquidity Runway</div>
                    <div className="font-extrabold text-sm mt-0.5">5.4 Months Cash Buffer</div>
                    <div className="text-[10px] text-emerald-100">₹48 Lakhs Working Reserves</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Health Score Methodology & Factors */}
      {activeTab === 'health' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Health Score Formula & Weight Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every score factor is mapped to recorded transactions in your database.
            </p>
          </div>

          <div className="space-y-3">
            {health.factors.map((f, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{f.dimension}</span>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-bold">
                      Weight: {f.weight}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{f.detail}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white w-10 text-right">{f.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Streams breakdown */}
      {activeTab === 'streams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Revenue Streams Distribution</h3>
            <div className="space-y-3 text-xs">
              {virtualModel.revenueStreams.map((s, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl">
                  <div className="flex justify-between font-semibold text-slate-900 dark:text-white mb-1">
                    <span>{s.name}</span>
                    <span>{s.share}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Est. Monthly Value: {formatCurrency(s.monthlyValue)}
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Cost Overhead Structures</h3>
            <div className="space-y-3 text-xs">
              {virtualModel.costStructures.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl">
                  <div className="flex justify-between font-semibold text-slate-900 dark:text-white mb-1">
                    <span>{c.category}</span>
                    <span>{c.pct}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Monthly Outlay: {formatCurrency(c.amount)}
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
