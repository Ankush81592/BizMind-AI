import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Layers,
  MapPin,
  Loader2,
  DollarSign,
  Download,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { MetricCard } from '../components/common/MetricCard';
import { DualBarChart, AreaTrendChart, DonutChart } from '../components/common/SimpleCharts';

export function SalesAnalyticsPage() {
  const { formatCurrency } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSales = async () => {
    setLoading(true);
    try {
      const res = await api.getSalesAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { kpis, monthlySales, channelPerformance, productPerformance, recentTransactions } = data;

  const filteredTransactions = recentTransactions.filter((t: any) =>
    t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales & Revenue Velocity Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time pipeline run-rate, conversion funnels, and channel attribution
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Recorded Sales"
          value={formatCurrency(kpis.totalRevenue)}
          change={14.2}
          icon={<DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          title="Total Units Sold"
          value={kpis.totalUnits}
          subtext="Licensed software packages"
          icon={<Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        />
        <MetricCard
          title="Avg Transaction Value"
          value={formatCurrency(kpis.avgDealSize)}
          subtext="Per closed subscription"
          icon={<TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          title="Lead to Deal Conversion"
          value={`${kpis.conversionRate}%`}
          subtext="Inbound & outbound blended"
          icon={<Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      {/* Main Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Monthly Sales Progression</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Gross cash collections over time</p>
          <AreaTrendChart
            data={monthlySales.map((m: any) => ({
              label: m.month.split(' ')[0],
              value: m.amount,
            }))}
            color="#2563EB"
            height={220}
          />
        </div>

        {/* Channel Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Sales by Acquisition Channel</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Enterprise outbound vs Inbound vs Partners</p>
          <DonutChart
            data={channelPerformance.map((c: any) => ({
              label: c.channel,
              value: c.revenue,
            }))}
            height={160}
          />
        </div>
      </div>

      {/* Product Profitability Matrix */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Product Catalog Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Units Sold</th>
                <th className="py-2.5 px-3">Revenue Contribution</th>
                <th className="py-2.5 px-3">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {productPerformance.map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{p.units}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{formatCurrency(p.revenue)}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      78.5%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions List with Search */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recorded Sales Transactions</h3>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Channel</th>
                <th className="py-2 px-3">Region</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.slice(0, 15).map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{t.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{t.customerName}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{t.product}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{t.channel}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{t.region}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{formatCurrency(t.amount)}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {t.status}
                    </span>
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
