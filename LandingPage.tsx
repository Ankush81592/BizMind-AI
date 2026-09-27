import { useState } from 'react';
import {
  Sparkles,
  Bot,
  Cpu,
  Sliders,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LandingPage() {
  const { navigateTo } = useBusiness();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does BizMind AI calculate my Business Digital Twin Health Score?',
      a: 'The health score is derived from actual ingested metrics across 6 operational dimensions: Financial health (margins and runway), Sales health (product diversity & conversion), Customer health (churn risk & LTV:CAC), Operational efficiency, Marketing ROI, and Workforce productivity.',
    },
    {
      q: 'What is the What-If Scenario Simulator?',
      a: 'The Scenario Simulator uses econometric elasticity algorithms to project future revenue, expenses, and net profitability when you adjust marketing budgets, pricing, headcount, or expected customer churn before committing capital.',
    },
    {
      q: 'Can I upload my existing business data?',
      a: 'Yes. BizMind AI supports CSV, Excel tabular imports, manual entries, and automated REST ingestion with automatic column detection and data validation.',
    },
    {
      q: 'How do the 10 AI Agents collaborate?',
      a: 'When you ask a complex question like "Why are my profits dropping?", the AI Orchestrator identifies and queries the Finance, Sales, and Operations agents in parallel, synthesizing findings into a unified, actionable executive response.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              BM
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">BizMind AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#agents" className="hover:text-slate-900 dark:hover:text-white transition-colors">AI Agents</a>
            <a href="#digital-twin" className="hover:text-slate-900 dark:hover:text-white transition-colors">Digital Twin</a>
            <a href="#simulator" className="hover:text-slate-900 dark:hover:text-white transition-colors">Scenario Simulator</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
            <a href="#support" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Support</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {user ? (
              <button
                onClick={() => navigateTo('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('login')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigateTo('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden text-center px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Multi-Agent Enterprise Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none">
            Your AI-Powered Business Command Center
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Analyze your business, simulate future scenarios, and make smarter decisions with a team of specialized AI agents and a live Digital Twin.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo(user ? 'dashboard' : 'register')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{user ? 'Open Dashboard' : 'Start Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Explore Live Demo Dashboard
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">10 Specialized</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Autonomous AI Agents</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">78/100</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Digital Twin Health Score</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">What-If</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Interactive Elasticity Modeling</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100% Secure</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Server-Side Data Isolation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Multi-Agent AI System */}
      <section id="agents" className="py-20 bg-white/60 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-2">Team of Specialists</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">10 Autonomous AI Business Agents</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
              Instead of a generic chatbot, deploy specialized AI officers for Strategy, Finance, Sales, Operations, HR, Risk, and Reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Business Strategy Agent', role: 'Chief Strategy Officer', desc: 'Analyzes holistic performance, competitive positioning, and long-range OKRs.' },
              { title: 'Sales Agent', role: 'VP of Sales', desc: 'Tracks conversion velocity, win/loss rates, and optimal pricing tiers.' },
              { title: 'Finance Agent', role: 'CFO Advisor', desc: 'Monitors cash burn, gross margins, unit economics, and expense anomalies.' },
              { title: 'Marketing Agent', role: 'Growth Lead', desc: 'Analyzes campaign ROAS, CAC, lead velocity, and channel attribution.' },
              { title: 'Customer Agent', role: 'Head of Customer Success', desc: 'Detects churn risk, monitors cohort retention, and tracks customer lifetime value.' },
              { title: 'Operations Agent', role: 'COO Advisor', desc: 'Identifies supply bottlenecks, cloud infrastructure spending, and fulfillment efficiency.' },
              { title: 'HR Agent', role: 'People Officer', desc: 'Calculates revenue per employee, headcount planning, and talent performance.' },
              { title: 'Risk Agent', role: 'Chief Risk Officer', desc: 'Uncovers revenue concentration risks, margin compressions, and cash runway threats.' },
              { title: 'Report Agent', role: 'Executive Briefing', desc: 'Combines cross-agent telemetry into formatted executive summaries and board decks.' },
            ].map((ag, i) => (
              <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-xs transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{ag.title}</h3>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded font-medium border border-blue-200 dark:border-blue-500/20">
                    {ag.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ag.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 2: Business Digital Twin */}
      <section id="digital-twin" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">Virtual Business Model</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">The Business Digital Twin</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed">
              Create an accurate virtual model of your enterprise. Map the flow from marketing leads to customers, operational costs to net profits, and monitor your transparent 0-100 Business Health Score.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Visual interactive business flowchart (Revenue, Expenses, Margins)',
                'Calculated Health Score (78/100) using 6 live operational dimensions',
                'Transparent formulas showing exact score weights and bottlenecks',
                'Continuous anomaly alerts for margin compression or churn spikes',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigateTo('digital-twin')}
              className="mt-8 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Live Calculated Score</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Business Health: 78 / 100</div>
              </div>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-200 dark:border-emerald-500/30">
                Healthy Grade A
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Financial Health (25% weight)</span>
                  <span className="font-bold text-slate-900 dark:text-white">82%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Sales Health (20% weight)</span>
                  <span className="font-bold text-slate-900 dark:text-white">76%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Customer Health (20% weight)</span>
                  <span className="font-bold text-slate-900 dark:text-white">80%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Operational Health (15% weight)</span>
                  <span className="font-bold text-slate-900 dark:text-white">74%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: What-If Scenario Simulator */}
      <section id="simulator" className="py-20 bg-white/60 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">
              Interactive What-If Simulation
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Marketing Budget Adjustment</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">+20%</span>
                </div>
                <div className="text-[11px] text-slate-500">Drives +14.5% projected sales expansion</div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Product Price Optimization</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+10%</span>
                </div>
                <div className="text-[11px] text-slate-500">Expands gross margins while balancing elasticity</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Baseline Revenue</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">₹14,50,000</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Profit: ₹5,60,000</div>
                </div>

                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Simulated Revenue</div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">₹16,60,250</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">Profit: ₹7,12,250 (+27%)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-2">Predictive Sandbox</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">What-If Scenario Simulator</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed">
              Test bold business moves risk-free. Adjust sliders for prices, marketing outlays, team headcount, and churn rates to see exact projected differences in revenue, operating cost, and bottom-line profit.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed">
              Save multiple scenarios (e.g. Scenario A vs Scenario B vs Scenario C) and evaluate side-by-side comparison tables.
            </p>

            <button
              onClick={() => navigateTo('scenarios')}
              className="mt-6 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider mb-2">Frequently Asked Questions</div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Got Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/60 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 text-base">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Exact Support Contact Banner */}
      <section id="support" className="py-16 bg-blue-50/80 dark:bg-blue-950/40 border-y border-blue-200 dark:border-blue-900/50 px-4 sm:px-6 text-center transition-colors">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Need Dedicated Assistance?</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Our enterprise engineering and business advisory desk is available around the clock. Contact us directly via your preferred channel:
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <a
              href="mailto:gbd9109@gmail.com?subject=BizMind%20AI%20Support%20Request"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-xs flex items-center gap-3.5 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Email Support</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  gbd9109@gmail.com
                </div>
              </div>
            </a>

            <a
              href="tel:+918988542477"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-xs flex items-center gap-3.5 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Call Hotline</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  +91 8988542477
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/917590081172?text=Hello%20BizMind%20AI%20Support%2C%20I%20need%20assistance%20with%20my%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-500 shadow-xs flex items-center gap-3.5 transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-600/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">WhatsApp Chat</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  +91 7590081172
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              BM
            </div>
            <span className="font-bold text-slate-900 dark:text-white">BizMind AI</span>
            <span>— AI Multi-Agent Business Manager & Digital Twin</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('dashboard')} className="hover:text-slate-900 dark:hover:text-slate-300">Dashboard</button>
            <button onClick={() => navigateTo('support')} className="hover:text-slate-900 dark:hover:text-slate-300">Support Center</button>
            <button onClick={() => navigateTo('login')} className="hover:text-slate-900 dark:hover:text-slate-300">Sign In</button>
            <button onClick={() => navigateTo('register')} className="hover:text-slate-900 dark:hover:text-slate-300">Create Account</button>
          </div>

          <div>
            © 2026 BizMind AI. Production SaaS Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
}
