import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  AlertTriangle,
  HeartHandshake,
  DollarSign,
  Loader2,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { MetricCard } from '../components/common/MetricCard';
import { DonutChart } from '../components/common/SimpleCharts';

export function CustomerAnalyticsPage() {
  const { formatCurrency } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomerAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { kpis, segments, churnRiskDist, customers } = data;

  const filteredCustomers = customers.filter((c: any) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = filterRisk === 'all' || c.churnRisk.toLowerCase() === filterRisk.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Intelligence & Retention Cohorts</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Client lifetime value (LTV), acquisition cost (CAC), churn risk segmentation, and account directory
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Active Accounts"
          value={kpis.activeCustomers}
          subtext={`${kpis.retentionRate}% Net Retention`}
          icon={<UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          title="Churn Risk Watch"
          value={kpis.atRiskCustomers}
          subtext="High vulnerability accounts"
          icon={<AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />}
        />
        <MetricCard
          title="Avg Lifetime Value"
          value={formatCurrency(kpis.avgLtv)}
          subtext="Per enterprise account"
          icon={<DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        />
        <MetricCard
          title="LTV : CAC Ratio"
          value={`${kpis.ltvCacRatio}x`}
          subtext="CAC payback: ~3.8 months"
          icon={<HeartHandshake className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        />
      </div>

      {/* Segmentation & Risk breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Customer Tier Segmentation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Enterprise, Mid-Market, and SMB composition</p>
          <DonutChart
            data={segments.map((s: any) => ({
              label: s.segment,
              value: s.count,
            }))}
            height={160}
          />
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Churn Risk Health Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Proactive customer health monitoring</p>
          <div className="space-y-3 text-xs">
            {churnRiskDist.map((r: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="font-semibold text-slate-900 dark:text-white">{r.risk}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">{r.count} accounts</span>
                  <span className="text-[11px] text-slate-400">
                    ({Math.round((r.count / kpis.totalCustomers) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise Account Directory</h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value)}
              className="text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk Only</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk Watch</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Client Contact</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3">Orders</th>
                <th className="py-2.5 px-3">LTV</th>
                <th className="py-2.5 px-3">Acquisition Cost</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[11px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">{c.company}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded">
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{c.totalOrders}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{formatCurrency(c.ltv)}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{formatCurrency(c.cac)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        c.churnRisk === 'Low'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : c.churnRisk === 'Medium'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {c.churnRisk} Risk
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{c.status}</span>
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
