import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Compass,
  Megaphone,
  Settings,
  Briefcase,
  ShieldAlert,
  Search,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { AIAgent, AgentRun } from '../types';

export function AIAgentsPage() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [recentRuns, setRecentRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Execution state
  const [selectedAgent, setSelectedAgent] = useState<string>('orchestrator');
  const [query, setQuery] = useState('');
  const [executing, setExecuting] = useState(false);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(null);

  const iconMap: Record<string, React.ReactNode> = {
    Compass: <Compass className="w-5 h-5 text-blue-600" />,
    TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    DollarSign: <DollarSign className="w-5 h-5 text-amber-600" />,
    Megaphone: <Megaphone className="w-5 h-5 text-purple-600" />,
    Users: <Users className="w-5 h-5 text-indigo-600" />,
    Settings: <Settings className="w-5 h-5 text-teal-600" />,
    Briefcase: <Briefcase className="w-5 h-5 text-rose-600" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-red-600" />,
    Search: <Search className="w-5 h-5 text-cyan-600" />,
    FileText: <FileText className="w-5 h-5 text-violet-600" />,
  };

  const loadAgents = async () => {
    try {
      const res = await api.getAgents();
      setAgents(res.agents);
      setRecentRuns(res.recentRuns || []);
      if (res.recentRuns && res.recentRuns.length > 0 && !currentRun) {
        setCurrentRun(res.recentRuns[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setExecuting(true);
    try {
      const res = await api.runAgent({
        agentType: selectedAgent,
        question: query.trim(),
      });
      setCurrentRun(res.run);
      setRecentRuns(prev => [res.run, ...prev]);
    } catch (err: any) {
      alert(err.message || 'Agent execution failed. Please retry.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Multi-Agent System & Orchestrator</h2>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            10 Autonomous Officers
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ask complex strategic questions and watch the AI Orchestrator coordinate specialized agents in real time.
        </p>
      </div>

      {/* Orchestrator Query Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Autonomous Agent Orchestration Engine</h3>
              <p className="text-xs text-slate-400">Select an individual agent or dispatch the full multi-agent council</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Agents Online
            </span>
          </div>
        </div>

        <form onSubmit={handleRun} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
              className="py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 shrink-0"
            >
              <option value="orchestrator">🎯 AI Orchestrator (Multi-Agent Council)</option>
              {agents.map(ag => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="e.g. Why are my profits falling? How can we expand gross margins by 15%?"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full text-xs py-2.5 pl-3 pr-24 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={executing || !query.trim()}
                className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {executing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Orchestrating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Agent</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Quick Test Prompts:</span>
            {[
              'Why are my profits falling?',
              'How to reduce CAC while scaling sales?',
              'Audit our high churn vulnerability accounts',
              'Prepare an executive Q3 board briefing',
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(p)}
                className="text-[10px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Agent Execution Timeline & Result Display (Section 8 requirement) */}
      {currentRun && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Execution Workflow Timeline
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                &ldquo;{currentRun.question}&rdquo;
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed (Confidence: {currentRun.result?.confidence || 96}%)
            </span>
          </div>

          {/* Visual Execution Timeline Step Flow */}
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200 dark:before:bg-blue-900">
            {currentRun.timeline.map((step, sIdx) => (
              <div key={sIdx} className="relative group">
                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow-xs flex items-center justify-center text-[9px] text-white font-bold" />
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{step.step}</span>
                    <span className="text-[10px] text-slate-400">{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">{step.details}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Synthesized Output & Actionable Plan */}
          {currentRun.result && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Executive Council Findings
                </h4>
                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {currentRun.result.summary}
                </div>
              </div>

              {/* Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider mb-2">
                    Key Telemetry Facts
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentRun.result.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 rounded-xl">
                  <h4 className="text-xs font-bold text-blue-950 dark:text-blue-300 uppercase tracking-wider mb-2">
                    Strategic Action Plan
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {currentRun.result.actionItems.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid of all 10 Specialized Agents */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">All 10 Specialized Autonomous Agents</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(ag => (
            <div
              key={ag.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                    {iconMap[ag.icon] || <Bot className="w-5 h-5 text-blue-600" />}
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-800/60">
                    {ag.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ag.name}</h4>
                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">{ag.role}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{ag.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {ag.capabilities.map((cap, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium border border-slate-200/50 dark:border-slate-700/50"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedAgent(ag.id);
                  setQuery(`Run a domain audit on our recent business telemetry.`);
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 hover:text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Dispatch {ag.name.split(' ')[0]} Agent</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
