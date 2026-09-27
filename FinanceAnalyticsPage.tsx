import { useState, useEffect } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Shield,
  Loader2,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { MetricCard } from '../components/common/MetricCard';
import { DualBarChart, DonutChart } from '../components/common/SimpleCharts';

export function FinanceAnalyticsPage() {
  const { formatCurrency } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadFinance = async () => {
    setLoading(true);
    try {
      const res = await api.getFinanceAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { kpis, monthlyCashFlow, expenseByCategory, expenseByDepartment, recentExpenses } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Financial Audit & Cash Flow Health</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Unit economics, monthly burn rate, departmental expense allocations, and liquidity runway
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Operating Profit"
          value={formatCurrency(kpis.netProfit)}
          subtext={`${kpis.netMargin}% net operating margin`}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          title="Monthly Cash Burn"
          value={formatCurrency(kpis.burnRateMonthly)}
          change={8.4}
          icon={<TrendingDown className="w-4 h-4 text-rose-500 dark:text-rose-400" />}
        />
        <MetricCard
          title="Estimated Cash Reserves"
          value={formatCurrency(kpis.estimatedCashReserves)}
          subtext="Available working capital"
          icon={<Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        />
        <MetricCard
          title="Liquidity Runway"
          value={`${kpis.runwayMonths} Months`}
          subtext="Zero debt liabilities"
          icon={<Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      {/* Monthly Cash Flow Trend Chart */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Net Operating Cash Flow</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Revenue intake vs Total operating disbursements</p>
          </div>
        </div>

        <DualBarChart
          data={monthlyCashFlow.map((m: any) => ({
            label: m.month.split(' ')[0],
            value: m.revenue,
            secondaryValue: m.expenses,
          }))}
          primaryColor="#2563EB"
          secondaryColor="#EF4444"
          primaryLabel="Revenue (₹)"
          secondaryLabel="Expenses (₹)"
          height={240}
        />
      </div>

      {/* Expense Allocation Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Expenses by Category</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Payroll, Cloud Hosting, Marketing, and Operations</p>
          <DonutChart
            data={expenseByCategory.map((c: any) => ({
              label: c.category,
              value: c.amount,
            }))}
            height={160}
          />
        </div>

        {/* Expenses by Department */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Expenses by Department</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Headcount and operational allocation</p>
          <div className="space-y-3 text-xs">
            {expenseByDepartment.map((d: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex justify-between font-semibold text-slate-900 dark:text-white mb-1">
                  <span>{d.department}</span>
                  <span>{formatCurrency(d.amount)} ({d.pct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Expense Transactions */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recent Operating Disbursements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Recurring</th>
                <th className="py-2.5 px-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentExpenses.slice(0, 10).map((e: any) => (
                <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{e.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{e.category}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{e.department}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{e.description}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                      {e.recurring ? 'Yes (Monthly)' : 'One-time'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
