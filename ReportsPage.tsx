import { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { BusinessReport } from '../types';

export function ReportsPage() {
  const { formatCurrency } = useBusiness();
  const [reports, setReports] = useState<BusinessReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BusinessReport | null>(null);

  // Generation Modal/Form
  const [reportType, setReportType] = useState<string>('Monthly Business Report');
  const [period, setPeriod] = useState<string>('September 2026');

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports();
      setReports(res.reports || []);
      if (res.reports && res.reports.length > 0 && !selectedReport) {
        setSelectedReport(res.reports[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.generateReport({
        type: reportType,
        period,
      });
      setReports(prev => [res.report, ...prev]);
      setSelectedReport(res.report);
    } catch (err: any) {
      alert(err.message || 'Failed to generate automated report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadCSV = (rep: BusinessReport) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        `Title,"${rep.title}"`,
        `Type,"${rep.type}"`,
        `Period,"${rep.period}"`,
        `Revenue,${rep.kpis.revenue}`,
        `Expenses,${rep.kpis.expenses}`,
        `Net Profit,${rep.kpis.netProfit}`,
        `Net Margin,${rep.kpis.profitMargin}%`,
        `Customer Count,${rep.kpis.customerCount}`,
        `Summary,"${rep.summary.replace(/"/g, '""')}"`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${rep.title.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Automated Business Report Generator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compile executive briefs, financial audits, sales summaries, and strategic action plans
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedReport && (
            <>
              <button
                onClick={() => handleDownloadCSV(selectedReport)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Download CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Print / Save PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generator Control Bar */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
          Configure & Generate Report
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Report Category</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Daily Summary">Daily Summary</option>
              <option value="Weekly Business Report">Weekly Business Report</option>
              <option value="Monthly Business Report">Monthly Business Report</option>
              <option value="Financial Report">Financial Report</option>
              <option value="Sales Report">Sales Report</option>
              <option value="Customer Report">Customer Report</option>
              <option value="Executive Summary">Executive Summary</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Audit Period</label>
            <input
              type="text"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              placeholder="e.g. September 2026 or Q3 2026"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Split View: Left report list, Right active report viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Index (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Archived Reports ({reports.length})
          </div>

          <div className="space-y-2">
            {reports.map(rep => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedReport?.id === rep.id
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>{rep.type}</span>
                  <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{rep.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Period: {rep.period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Report Document (8 cols) */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0 transition-colors">
              {/* Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  <span>{selectedReport.type}</span>
                  <span>Audit Window: {selectedReport.period}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedReport.title}</h1>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Generated via BizMind AI Autonomous Report Engine on {new Date(selectedReport.createdAt).toLocaleString()}
                </div>
              </div>

              {/* KPIs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-slate-500 dark:text-slate-400">Gross Revenue</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatCurrency(selectedReport.kpis.revenue)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-slate-500 dark:text-slate-400">Operating Cost</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatCurrency(selectedReport.kpis.expenses)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-slate-500 dark:text-slate-400">Net Profit</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatCurrency(selectedReport.kpis.netProfit)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="text-slate-500 dark:text-slate-400">Net Margin</div>
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {selectedReport.kpis.profitMargin}%
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Executive Summary</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedReport.summary}
                </div>
              </div>

              {/* Strategic Insights */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Key Analytical Insights</h3>
                <div className="space-y-2 text-xs">
                  {selectedReport.insights.map((insight, idx) => (
                    <div key={idx} className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-lg flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-slate-800 dark:text-slate-200 leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Recommended Next Actions</h3>
                <div className="space-y-2 text-xs">
                  {selectedReport.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-800 dark:text-slate-200 leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Observations / Bottlenecks */}
              {selectedReport.keyObservations && selectedReport.keyObservations.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Operational Bottlenecks & Vulnerabilities</h3>
                  <div className="space-y-2 text-xs">
                    {selectedReport.keyObservations.map((obs, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-lg flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-slate-200 leading-relaxed">{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              Select or generate a report to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
