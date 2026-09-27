import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Database,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';

export function DataImportPage() {
  const { navigateTo } = useBusiness();
  const [category, setCategory] = useState<'Sales' | 'Expenses' | 'Customers'>('Sales');
  const [rawText, setRawText] = useState('');
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sample templates to paste
  const sampleCSVMap: Record<string, string> = {
    Sales: `date,product,customerName,amount,units,channel,region
2026-09-01,Apex ERP Cloud Pro,Bharat Logistics Corp,45000,1,Enterprise Direct,India - West
2026-09-05,Apex Workflow Automation Suite,Zenith FinTech Labs,28000,1,Inbound Web,India - North
2026-09-12,Apex AI Intelligence Add-on,Solaris Green Power,18000,1,Upsell,India - South
2026-09-18,Apex Custom API Gateway,Tata Mobility Systems,65000,1,Enterprise Direct,India - West`,

    Expenses: `date,category,department,amount,description,recurring
2026-09-01,Payroll,Engineering & Product,180000,Monthly engineering salary pool,true
2026-09-05,Marketing,Growth & Demand Gen,60000,Search advertising campaign,false
2026-09-10,Infrastructure,Cloud DevOps,48000,Kubernetes hosting cluster,true
2026-09-15,Operations,Admin & Office,25000,Office facilities and utilities,true`,

    Customers: `name,company,email,segment,ltv,cac,churnRisk
Aarav Singhania,Bharat Logistics Corp,aarav@bharatlogistics.in,Enterprise,540000,38000,Low
Pooja Deshmukh,Zenith FinTech Labs,pooja@zenithfinlabs.com,Enterprise,420000,32000,Low
Kunal Aggarwal,Indus Retail Networks,kunal@indusretail.co,Mid-Market,290000,24000,Medium
Rohan Mehra,Solaris Green Power,rohan@solarispwr.com,Mid-Market,210000,28000,High`,
  };

  const handleValidate = async () => {
    if (!rawText.trim()) {
      setError('Please provide CSV or tabular data text.');
      return;
    }
    setValidating(true);
    setError(null);
    try {
      const res = await api.validateImport(rawText.trim(), category);
      setValidationResult(res);
    } catch (err: any) {
      setError(err.message || 'Validation failed. Check header and delimiter structure.');
    } finally {
      setValidating(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationResult) return;
    setImporting(true);
    setError(null);
    try {
      // Build rows from preview
      const headers = validationResult.headers;
      const rows = validationResult.previewRows.map((row: string[]) => {
        const obj: Record<string, any> = {};
        headers.forEach((h: string, idx: number) => {
          const mappedKey = validationResult.suggestedMapping[h] || h;
          obj[mappedKey] = row[idx];
        });
        return obj;
      });

      const res = await api.confirmImport({
        category,
        rows,
      });

      setSuccessMsg(res.message);
      setValidationResult(null);
      setRawText('');
    } catch (err: any) {
      setError(err.message || 'Failed to merge dataset.');
    } finally {
      setImporting(false);
    }
  };

  const handleLoadSampleDataset = async (type: 'saas' | 'retail') => {
    setImporting(true);
    try {
      const res = await api.loadSampleImport(type);
      setSuccessMsg(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to import sample dataset.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Import & Schema Ingestion Engine</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ingest and validate Sales, Expenses, Customers, or pre-built sample datasets into your command center
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button
            onClick={() => navigateTo('dashboard')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Updated Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick 1-Click Sample Dataset Buttons */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Instant Sample Business Datasets</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Populate realistic enterprise records with one click to stress-test your Digital Twin
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLoadSampleDataset('saas')}
              disabled={importing}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Merge B2B SaaS Pack
            </button>
            <button
              onClick={() => handleLoadSampleDataset('retail')}
              disabled={importing}
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Merge Retail POS Pack
            </button>
          </div>
        </div>
      </div>

      {/* Main Import Workstation */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Custom Tabular Import</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Paste comma-separated rows or pick a preset template</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Category:</span>
            {(['Sales', 'Expenses', 'Customers'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setRawText(sampleCSVMap[cat]);
                  setValidationResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Raw CSV / Tabular Text</span>
            <button
              type="button"
              onClick={() => setRawText(sampleCSVMap[category])}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Load {category} Sample Schema
            </button>
          </div>
          <textarea
            rows={7}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Paste your CSV text here with headers on line 1..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleValidate}
            disabled={validating || !rawText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            {validating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Validate Structure & Preview Columns</span>
          </button>
        </div>

        {/* Validation Preview & Column Mapping (Section 14 requirements) */}
        {validationResult && (
          <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4 text-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Data Validated: {validationResult.totalRows} row(s) detected
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-medium">Category: {validationResult.category}</span>
            </div>

            {/* Column Detection / Mapping Tags */}
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Detected Column Mappings
              </div>
              <div className="flex flex-wrap gap-2">
                {validationResult.headers.map((h: string) => (
                  <div
                    key={h}
                    className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2"
                  >
                    <span className="font-mono text-slate-500 dark:text-slate-400">{h}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {validationResult.suggestedMapping[h] || 'custom'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Preview */}
            <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    {validationResult.headers.map((h: string, i: number) => (
                      <th key={i} className="py-2 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {validationResult.previewRows.map((row: string[], rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      {row.map((cell: string, cIdx: number) => (
                        <td key={cIdx} className="py-2 px-3 text-slate-800 dark:text-slate-200">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleConfirmImport}
                disabled={importing}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                <span>Confirm & Ingest into Database</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
