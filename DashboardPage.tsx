import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Briefcase,
  Sparkles,
  Bot,
  Cpu,
  Sliders,
  Send,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { DualBarChart, AreaTrendChart } from '../components/common/SimpleCharts';
import { DashboardData } from '../types';

export function DashboardPage() {
  const { navigateTo, formatCurrency } = useBusiness();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ask BizMind AI quick input
  const [question, setQuestion] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<{ question: string; answer: string; supportingMetrics: any } | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load business dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAskLoading(true);
    try {
      const res = await api.askDashboardAI(question.trim());
      setAiAnswer(res);
      setQuestion('');
    } catch (err: any) {
      alert(err.message || 'AI Copilot unavailable. Please retry.');
    } finally {
      setAskLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aggregating live business command center telemetry...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-xl text-center max-w-xl mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Dashboard Unavailable</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{error}</p>
        <button
          onClick={fetchDashboard}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
        >
          Retry Ingestion
        </button>
      </div>
    );
  }

  const { kpis, charts, aiInsight, business } = data;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Command Center</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Live Twin Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
            {business.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Operational Health Score: <span className="font-bold text-emerald-400">{business.healthScore}/100</span> · Currency: {business.currency}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigateTo('scenarios')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={() => navigateTo('agents')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Agents (10)</span>
          </button>

          <button
            onClick={() => navigateTo('digital-twin')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 rounded-lg transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Digital Twin</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (7 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          title="Revenue"
          value={formatCurrency(kpis.revenue)}
          change={kpis.growthRate}
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        />
        <MetricCard
          title="Expenses"
          value={formatCurrency(kpis.expenses)}
          change={kpis.expenseGrowth}
          icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(kpis.netProfit)}
          subtext={`${kpis.profitMargin}% margin`}
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
        />
        <MetricCard
          title="Customers"
          value={kpis.customers}
          subtext="Active accounts"
          icon={<Users className="w-4 h-4 text-indigo-600" />}
        />
        <MetricCard
          title="Orders"
          value={kpis.orders}
          subtext="Total transactions"
          icon={<ShoppingCart className="w-4 h-4 text-amber-600" />}
        />
        <MetricCard
          title="Employees"
          value={kpis.employees}
          subtext="Active headcount"
          icon={<Briefcase className="w-4 h-4 text-purple-600" />}
        />
        <MetricCard
          title="Growth Rate"
          value={`${kpis.growthRate}%`}
          subtext="MoM expansion"
          icon={<TrendingUp className="w-4 h-4 text-teal-600" />}
        />
      </div>

      {/* AI Insight Panel & Quick Ask BizMind AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights Summary */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">BizMind Autonomous Insight</h3>
                <div className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">{aiInsight.headline}</div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('copilot')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              Open Full Copilot →
            </button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/80 p-3.5 rounded-xl border border-blue-100 dark:border-slate-800">
            {aiInsight.detail}
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {aiInsight.keyTakeaways.map((point, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-blue-100/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                <div className="font-semibold text-blue-950 dark:text-blue-300 mb-0.5">Finding #{idx + 1}</div>
                <div className="leading-snug text-slate-600 dark:text-slate-400">{point}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Ask BizMind AI Quick Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Ask BizMind AI</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Ask anything about your business data (e.g. &ldquo;Why did profit change?&rdquo; or &ldquo;Which product generates the most cash?&rdquo;)
            </p>

            <form onSubmit={handleQuickAsk} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Why did revenue increase last month?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full text-xs py-2.5 pl-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={askLoading || !question.trim()}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
                  title="Ask"
                >
                  {askLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Sample Quick Questions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Why did revenue increase?',
                  'Which product has best margin?',
                  'Where is cash being spent?',
                ].map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => setQuestion(sample)}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Quick Result if answered */}
          {aiAnswer && (
            <div className="mt-4 p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs space-y-1.5">
              <div className="font-semibold text-blue-900 dark:text-blue-300 text-[11px]">&ldquo;{aiAnswer.question}&rdquo;</div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-4">{aiAnswer.answer}</p>
              <button
                onClick={() => navigateTo('copilot')}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold pt-1 block"
              >
                Continue in AI Copilot with full charts →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue vs Expenses (12 Months) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue vs Operating Expenses</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">12-month historical performance</p>
            </div>
            <button
              onClick={() => navigateTo('finance')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800"
            >
              Finance Details →
            </button>
          </div>

          <DualBarChart
            data={charts.revenueVsExpenses.map(r => ({
              label: r.month.split(' ')[0],
              value: r.revenue,
              secondaryValue: r.expenses,
            }))}
            primaryColor="#2563EB"
            secondaryColor="#EF4444"
            primaryLabel="Revenue (₹)"
            secondaryLabel="Expenses (₹)"
            height={220}
          />
        </div>

        {/* Chart 2: Net Profit Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Net Operational Profit Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly bottom-line progression</p>
            </div>
            <button
              onClick={() => navigateTo('sales')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800"
            >
              Sales Analytics →
            </button>
          </div>

          <AreaTrendChart
            data={charts.profitTrend.map(p => ({
              label: p.month.split(' ')[0],
              value: p.profit,
            }))}
            color="#10B981"
            height={220}
          />
        </div>
      </div>

      {/* Secondary Charts: Product Performance & Customer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product/Service Performance (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Product & Service Line Profitability</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Breakdown by margin and deployed license units</p>
            </div>
            <button
              onClick={() => navigateTo('sales')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800"
            >
              View Catalog
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-y border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Units</th>
                  <th className="py-2.5 px-3">Total Revenue</th>
                  <th className="py-2.5 px-3">Gross Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {charts.productPerformance.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{p.category}</td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{p.units}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{formatCurrency(p.revenue)}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        {p.marginPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Growth & Churn Health (1 col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Growth</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active enterprise base</p>
              </div>
              <button
                onClick={() => navigateTo('customers')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800"
              >
                Customers →
              </button>
            </div>

            <AreaTrendChart
              data={charts.customerGrowth.map(c => ({
                label: c.month.split(' ')[0],
                value: c.count,
              }))}
              color="#6366F1"
              height={140}
              formatValue={(v) => `${v} accounts`}
            />

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Retention Rate:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">96.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">LTV to CAC Ratio:</span>
                <span className="font-bold text-slate-900 dark:text-white">11.6x (Healthy)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Avg Account ARR:</span>
                <span className="font-bold text-slate-900 dark:text-white">₹4,20,000</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('customers')}
            className="w-full mt-4 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Inspect Churn Watchlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
