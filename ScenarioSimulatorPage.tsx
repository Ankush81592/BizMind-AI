import { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  GitCompare,
  DollarSign,
  Users,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { DualBarChart } from '../components/common/SimpleCharts';
import confetti from 'canvas-confetti';

export function ScenarioSimulatorPage() {
  const { formatCurrency, navigateTo } = useBusiness();

  // Baseline metrics (default to current monthly numbers)
  const baselineRevenue = 1450000;
  const baselineExpenses = 890000;
  const baselineCustomers = 84;

  // Sliders
  const [priceChangePct, setPriceChangePct] = useState(0);
  const [marketingBudgetChangePct, setMarketingBudgetChangePct] = useState(20);
  const [employeeChangeCount, setEmployeeChangeCount] = useState(0);
  const [avgSalary, setAvgSalary] = useState(115000);
  const [salesGrowthPct, setSalesGrowthPct] = useState(0);
  const [churnChangePct, setChurnChangePct] = useState(-1);
  const [operatingExpenseChangePct, setOperatingExpenseChangePct] = useState(0);

  // Simulation output
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Save Modal
  const [scenarioName, setScenarioName] = useState('20% Marketing Expansion Model');
  const [scenarioDesc, setScenarioDesc] = useState('Simulation evaluating 20% marketing budget increase against inbound customer acquisition.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.simulateScenario({
        baselineRevenue,
        baselineExpenses,
        baselineCustomers,
        priceChangePct,
        marketingBudgetChangePct,
        employeeChangeCount,
        avgSalary,
        salesGrowthPct,
        churnChangePct,
        operatingExpenseChangePct,
      });
      setSimResult(res.simulation);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [
    priceChangePct,
    marketingBudgetChangePct,
    employeeChangeCount,
    avgSalary,
    salesGrowthPct,
    churnChangePct,
    operatingExpenseChangePct,
  ]);

  const handleResetSliders = () => {
    setPriceChangePct(0);
    setMarketingBudgetChangePct(0);
    setEmployeeChangeCount(0);
    setSalesGrowthPct(0);
    setChurnChangePct(0);
    setOperatingExpenseChangePct(0);
  };

  const handlePreset = (preset: string) => {
    handleResetSliders();
    if (preset === 'marketing_20') {
      setMarketingBudgetChangePct(20);
      setScenarioName('20% Marketing Budget Increase');
      setScenarioDesc('Model the impact of raising ad spend by 20% to drive inbound pipeline.');
    } else if (preset === 'price_10') {
      setPriceChangePct(10);
      setScenarioName('10% Price Increase on Flagship ERP');
      setScenarioDesc('Assess profit elasticity with 10% unit price increase.');
    } else if (preset === 'sales_15') {
      setSalesGrowthPct(15);
      setScenarioName('15% Accelerated Sales Growth');
      setScenarioDesc('Model top-line expansion assuming 15% broader outbound closing rate.');
    } else if (preset === 'hire_5') {
      setEmployeeChangeCount(5);
      setOperatingExpenseChangePct(5);
      setScenarioName('Hire 5 Sales & Engineering Personnel');
      setScenarioDesc('Evaluate payroll cost surge against expected team capacity.');
    } else if (preset === 'expenses_8') {
      setOperatingExpenseChangePct(8);
      setScenarioName('8% Operating Expenses Inflation');
      setScenarioDesc('Stress-test business margins against general operational cost increases.');
    } else if (preset === 'churn_minus_5') {
      setChurnChangePct(-5);
      setScenarioName('Reduce Customer Churn by 5%');
      setScenarioDesc('Assess compounding revenue preservation from 5% churn reduction.');
    }
  };

  const handleSaveScenario = async () => {
    if (!simResult) return;
    try {
      await api.saveScenario({
        name: scenarioName,
        description: scenarioDesc,
        parameters: {
          priceChangePct,
          marketingBudgetChangePct,
          employeeChangeCount,
          avgSalary,
          salesGrowthPct,
          churnChangePct,
          operatingExpenseChangePct,
        },
        baseline: simResult.baseline,
        simulated: simResult.simulated,
        delta: simResult.delta,
      });

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to save scenario.');
    }
  };

  const sim = simResult?.simulated;
  const delta = simResult?.delta;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">What-If Scenario Simulator</h2>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              Econometric Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test adjustments to marketing, pricing, headcount, and churn before committing capital
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('scenarios-compare')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Scenario Comparison Desk</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons Bar (Prompt Section 12 requirements) */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs space-y-2 transition-colors">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Scenario Presets:</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handlePreset('marketing_20')}
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer"
          >
            Increase Marketing +20%
          </button>
          <button
            onClick={() => handlePreset('price_10')}
            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium rounded-lg border border-emerald-200 dark:border-emerald-800 cursor-pointer"
          >
            Increase Price +10%
          </button>
          <button
            onClick={() => handlePreset('sales_15')}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-medium rounded-lg border border-indigo-200 dark:border-indigo-800 cursor-pointer"
          >
            Sales Expansion +15%
          </button>
          <button
            onClick={() => handlePreset('hire_5')}
            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-medium rounded-lg border border-purple-200 dark:border-purple-800 cursor-pointer"
          >
            Hire 5 Employees
          </button>
          <button
            onClick={() => handlePreset('expenses_8')}
            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-medium rounded-lg border border-rose-200 dark:border-rose-800 cursor-pointer"
          >
            Expenses Rise +8%
          </button>
          <button
            onClick={() => handlePreset('churn_minus_5')}
            className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-medium rounded-lg border border-teal-200 dark:border-teal-800 cursor-pointer"
          >
            Customer Churn −5%
          </button>
        </div>
      </div>

      {/* Main Split Grid: Sliders on Left, Live Outcome on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Simulation Controls</span>
            </h3>
            <button
              onClick={handleResetSliders}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Marketing Spend */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Marketing Budget:</span>
              <span className={marketingBudgetChangePct >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}>
                {marketingBudgetChangePct > 0 ? '+' : ''}{marketingBudgetChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={marketingBudgetChangePct}
              onChange={e => setMarketingBudgetChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-50%</span>
              <span>Baseline</span>
              <span>+100%</span>
            </div>
          </div>

          {/* Slider 2: Product Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Product Price Adjustment:</span>
              <span className={priceChangePct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {priceChangePct > 0 ? '+' : ''}{priceChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="2"
              value={priceChangePct}
              onChange={e => setPriceChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-30%</span>
              <span>Baseline</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Slider 3: Direct Sales Growth */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Sales Velocity Growth:</span>
              <span className={salesGrowthPct >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}>
                {salesGrowthPct > 0 ? '+' : ''}{salesGrowthPct}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="80"
              step="5"
              value={salesGrowthPct}
              onChange={e => setSalesGrowthPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-40%</span>
              <span>Baseline</span>
              <span>+80%</span>
            </div>
          </div>

          {/* Slider 4: Employee Count */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Employee Headcount (+/-):</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {employeeChangeCount > 0 ? '+' : ''}{employeeChangeCount} personnel
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="15"
              step="1"
              value={employeeChangeCount}
              onChange={e => setEmployeeChangeCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-5</span>
              <span>Current</span>
              <span>+15</span>
            </div>
          </div>

          {/* Slider 5: Churn Change */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Customer Churn Rate Shift:</span>
              <span className={churnChangePct <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {churnChangePct > 0 ? '+' : ''}{churnChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="15"
              step="1"
              value={churnChangePct}
              onChange={e => setChurnChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-10% (Retention Boost)</span>
              <span>+15% (Loss)</span>
            </div>
          </div>

          {/* Slider 6: General Operating Expenses */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Operating Expenses Shift:</span>
              <span className={operatingExpenseChangePct > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {operatingExpenseChangePct > 0 ? '+' : ''}{operatingExpenseChangePct}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="2"
              value={operatingExpenseChangePct}
              onChange={e => setOperatingExpenseChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>-20% (Cost Cutting)</span>
              <span>+40%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Metrics & Visual Outcomes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparison Cards: Baseline vs Simulated (Prompt Section 12) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Baseline Card */}
            <div className="p-5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl transition-colors">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Current Baseline (Monthly)
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Revenue:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(baselineRevenue)}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Expenses:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(baselineExpenses)}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Net Profit:</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">{formatCurrency(baselineRevenue - baselineExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Active Customers:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{baselineCustomers}</span>
                </div>
              </div>
            </div>

            {/* Simulated Outcome Card */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl shadow-xs transition-colors">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2 flex items-center justify-between">
                <span>Simulated Business Model</span>
                {delta && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    delta.profitDiff >= 0 ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {delta.profitDiff >= 0 ? '+' : ''}{delta.profitPct}% Profit
                  </span>
                )}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between pb-1 border-b border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-slate-700 dark:text-slate-300">Simulated Revenue:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sim ? formatCurrency(sim.revenue) : 'Calculating...'}
                  </span>
                </div>
                <div className="flex justify-between pb-1 border-b border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-slate-700 dark:text-slate-300">Simulated Expenses:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {sim ? formatCurrency(sim.expenses) : 'Calculating...'}
                  </span>
                </div>
                <div className="flex justify-between pb-1 border-b border-blue-200/60 dark:border-blue-900/40">
                  <span className="text-slate-700 dark:text-slate-300">Simulated Net Profit:</span>
                  <span className={`font-bold ${sim && sim.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {sim ? formatCurrency(sim.profit) : 'Calculating...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Simulated Customers:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sim?.customers || baselineCustomers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Highlights Table */}
          {delta && (
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs transition-colors">
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-3">Projected Net Differences</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Revenue Change</div>
                  <div className={`font-bold mt-0.5 ${delta.revenueDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {delta.revenueDiff >= 0 ? '+' : ''}{formatCurrency(delta.revenueDiff)} ({delta.revenuePct}%)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Expense Change</div>
                  <div className={`font-bold mt-0.5 ${delta.expenseDiff <= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {delta.expenseDiff >= 0 ? '+' : ''}{formatCurrency(delta.expenseDiff)} ({delta.expensePct}%)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Net Profit Change</div>
                  <div className={`font-bold mt-0.5 ${delta.profitDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {delta.profitDiff >= 0 ? '+' : ''}{formatCurrency(delta.profitDiff)} ({delta.profitPct}%)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Customer Base Shift</div>
                  <div className={`font-bold mt-0.5 ${delta.customerDiff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {delta.customerDiff >= 0 ? '+' : ''}{delta.customerDiff} accounts
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comparative Chart */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Visual Projection: Current vs Simulated Model
            </h4>
            {sim && (
              <DualBarChart
                data={[
                  { label: 'Revenue', value: baselineRevenue, secondaryValue: sim.revenue },
                  { label: 'Expenses', value: baselineExpenses, secondaryValue: sim.expenses },
                  { label: 'Net Profit', value: baselineRevenue - baselineExpenses, secondaryValue: sim.profit },
                ]}
                primaryColor="#94A3B8"
                secondaryColor="#2563EB"
                primaryLabel="Current Baseline (₹)"
                secondaryLabel="Simulated Scenario (₹)"
                height={200}
              />
            )}
          </div>

          {/* Mandatory Disclaimer (Section 12 requirement) */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl text-xs flex items-start gap-2.5 transition-colors">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <strong>Methodology Notice:</strong> Projections represent mathematical simulations and estimates
              derived from elasticity assumptions. They do not constitute guaranteed financial outcomes.
            </div>
          </div>

          {/* Save Scenario Box (Section 13) */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3 transition-colors">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Save This Simulation for Comparison
            </h4>

            {savedSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scenario saved to your Comparison Desk!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Scenario Title</label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={e => setScenarioName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Model Description</label>
                <input
                  type="text"
                  value={scenarioDesc}
                  onChange={e => setScenarioDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSaveScenario}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Scenario</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('scenarios-compare')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Comparison Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
