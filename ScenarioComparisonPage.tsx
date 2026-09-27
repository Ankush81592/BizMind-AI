import { useState, useEffect } from 'react';
import {
  GitCompare,
  Sliders,
  Copy,
  Trash2,
  Play,
  Download,
  CheckCircle2,
  Loader2,
  Plus,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { Scenario } from '../types';

export function ScenarioComparisonPage() {
  const { formatCurrency, navigateTo } = useBusiness();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  const baseline = {
    revenue: 1450000,
    expenses: 890000,
    profit: 560000,
    customers: 84,
  };

  const loadScenarios = async () => {
    setLoading(true);
    try {
      const res = await api.getScenarios();
      setScenarios(res.scenarios || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicateScenario(id);
      await loadScenarios();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate scenario.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this saved scenario?')) {
      try {
        await api.deleteScenario(id);
        setScenarios(prev => prev.filter(s => s.id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete scenario.');
      }
    }
  };

  const handleExportCSV = () => {
    if (scenarios.length === 0) return;
    const header = ['Metric', 'Current Baseline', ...scenarios.map(s => `"${s.name}"`)].join(',');
    const rows = [
      ['Revenue (₹)', baseline.revenue, ...scenarios.map(s => s.simulated.revenue)].join(','),
      ['Expenses (₹)', baseline.expenses, ...scenarios.map(s => s.simulated.expenses)].join(','),
      ['Net Profit (₹)', baseline.profit, ...scenarios.map(s => s.simulated.profit)].join(','),
      ['Profit Margin (%)', Math.round((baseline.profit / baseline.revenue) * 100), ...scenarios.map(s => Math.round((s.simulated.profit / s.simulated.revenue) * 100))].join(','),
      ['Active Customers', baseline.customers, ...scenarios.map(s => s.simulated.customers)].join(','),
      ['Health Score (/100)', 78, ...scenarios.map(s => s.simulated.healthScore || 80)].join(','),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bizmind_scenario_comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Scenario Comparison Matrix</h2>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {scenarios.length} Saved Models
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare multiple what-if simulations side-by-side against current financial baseline
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={scenarios.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => navigateTo('scenarios')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Scenario</span>
          </button>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center max-w-lg mx-auto">
          <GitCompare className="w-10 h-10 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Saved Scenarios Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Run the What-If Simulator and click &ldquo;Save Scenario&rdquo; to benchmark multiple strategic decisions.
          </p>
          <button
            onClick={() => navigateTo('scenarios')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Launch Scenario Simulator →
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
          {/* Responsive Comparison Table (Section 13 requirement) */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[10px] w-48">
                    Key Performance Metric
                  </th>
                  <th className="py-3.5 px-4 font-bold bg-slate-800 dark:bg-slate-900 text-emerald-400 min-w-[140px]">
                    Current Baseline
                  </th>
                  {scenarios.map((sc, sIdx) => (
                    <th key={sc.id} className="py-3.5 px-4 font-bold text-white min-w-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="truncate max-w-[140px]">Scenario {String.fromCharCode(65 + sIdx)}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDuplicate(sc.id)}
                            title="Duplicate"
                            className="p-1 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(sc.id)}
                            title="Delete"
                            className="p-1 rounded hover:bg-slate-700 text-rose-300 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] font-normal text-slate-400 truncate mt-0.5">{sc.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {/* Revenue Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Monthly Revenue</td>
                  <td className="py-3 px-4 font-bold bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white">
                    {formatCurrency(baseline.revenue)}
                  </td>
                  {scenarios.map(sc => {
                    const diff = sc.simulated.revenue - baseline.revenue;
                    return (
                      <td key={sc.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{formatCurrency(sc.simulated.revenue)}</div>
                        <div className={`text-[10px] ${diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {diff >= 0 ? '+' : ''}{formatCurrency(diff)} ({sc.delta.revenuePct}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Expenses Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Operating Expenses</td>
                  <td className="py-3 px-4 font-bold bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white">
                    {formatCurrency(baseline.expenses)}
                  </td>
                  {scenarios.map(sc => {
                    const diff = sc.simulated.expenses - baseline.expenses;
                    return (
                      <td key={sc.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        <div>{formatCurrency(sc.simulated.expenses)}</div>
                        <div className={`text-[10px] ${diff <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {diff >= 0 ? '+' : ''}{formatCurrency(diff)} ({sc.delta.expensePct}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Net Profit Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-blue-50/20 dark:bg-blue-950/20">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Net Operational Profit</td>
                  <td className="py-3 px-4 font-extrabold bg-blue-50/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {formatCurrency(baseline.profit)}
                  </td>
                  {scenarios.map(sc => {
                    const diff = sc.simulated.profit - baseline.profit;
                    return (
                      <td key={sc.id} className="py-3 px-4 font-extrabold">
                        <div className={sc.simulated.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {formatCurrency(sc.simulated.profit)}
                        </div>
                        <div className={`text-[10px] ${diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {diff >= 0 ? '+' : ''}{formatCurrency(diff)} ({sc.delta.profitPct}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Profit Margin Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Net Profit Margin</td>
                  <td className="py-3 px-4 font-bold bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white">
                    {Math.round((baseline.profit / baseline.revenue) * 100)}%
                  </td>
                  {scenarios.map(sc => {
                    const margin = sc.simulated.revenue > 0
                      ? Math.round((sc.simulated.profit / sc.simulated.revenue) * 100)
                      : 0;
                    return (
                      <td key={sc.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {margin}%
                      </td>
                    );
                  })}
                </tr>

                {/* Customers Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Active Customers</td>
                  <td className="py-3 px-4 font-bold bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white">
                    {baseline.customers}
                  </td>
                  {scenarios.map(sc => (
                    <td key={sc.id} className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{sc.simulated.customers}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {sc.delta.customerDiff > 0 ? '+' : ''}{sc.delta.customerDiff} shift
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Health Score Row */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Digital Twin Health Score</td>
                  <td className="py-3 px-4 font-bold bg-slate-50 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400">
                    78 / 100
                  </td>
                  {scenarios.map(sc => (
                    <td key={sc.id} className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {sc.simulated.healthScore || 81} / 100
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="bg-slate-50/80 dark:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-400">Simulator Action</td>
                  <td className="py-3 px-4 text-slate-400 dark:text-slate-500 italic">Reference Baseline</td>
                  {scenarios.map(sc => (
                    <td key={sc.id} className="py-3 px-4">
                      <button
                        onClick={() => navigateTo('scenarios')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run Again in Simulator</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
