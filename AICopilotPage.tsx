import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Trash2,
  TrendingUp,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Bot,
  User,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { ChatMessage } from '../types';
import { DualBarChart, AreaTrendChart, DonutChart } from '../components/common/SimpleCharts';

export function AICopilotPage() {
  const { navigateTo, formatCurrency } = useBusiness();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What caused my sales drop?',
    'Which product is most profitable?',
    'Which customers are at risk of leaving?',
    'Where am I spending too much?',
    'How can I increase profit?',
    'Which department has the highest cost?',
    'Compare this month with last month.',
  ];

  const loadHistory = async () => {
    try {
      const res = await api.getCopilotMessages();
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setInput('');
    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.sendCopilotMessage(query.trim());
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, res.message]);
    } catch (err: any) {
      alert(err.message || 'AI Copilot encountered an error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Clear entire AI conversation history?')) {
      try {
        await api.clearCopilot();
        setMessages([]);
      } catch (err: any) {
        alert(err.message || 'Failed to clear conversation.');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
      {/* Copilot Header */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-2">
              BizMind AI Business Copilot
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                Context Loaded
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Grounded strictly in your live database & metrics</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
        {fetchingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto my-auto py-12">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 border border-blue-100 dark:border-blue-900/50">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">How can I assist your business today?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              I can analyze your sales run-rate, calculate customer lifetime value, spot expense anomalies, or simulate scenarios.
            </p>

            <div className="w-full space-y-2 text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                Click a prompt to begin:
              </div>
              {suggestedQuestions.slice(0, 4).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 hover:bg-blue-50/70 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span>{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-normal">{msg.content}</div>

                {/* Supporting metrics block if returned */}
                {msg.metrics && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {Object.entries(msg.metrics).map(([key, val]) => (
                      <div key={key} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                        <div className="text-slate-500 dark:text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {typeof val === 'number' && val > 1000 ? formatCurrency(val) : String(val)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Relevant charts if attached to response */}
                {msg.charts && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">{msg.charts.title}</div>
                    {msg.charts.type === 'pie' ? (
                      <DonutChart data={msg.charts.data} height={140} />
                    ) : (
                      <AreaTrendChart data={msg.charts.data} height={140} />
                    )}
                  </div>
                )}

                {/* Recommended action buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Recommended Next Actions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            if (act.includes('Scenario')) navigateTo('scenarios');
                            else if (act.includes('Report')) navigateTo('reports');
                            else if (act.includes('Churn')) navigateTo('customers');
                            else if (act.includes('Finance')) navigateTo('finance');
                            else handleSend(act);
                          }}
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-slate-600 px-2 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {act} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] mt-2 ${
                    msg.role === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-700 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-xs text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Ingesting live business metrics and compiling analysis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested quick chips */}
      {messages.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap flex gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[10px] bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700 transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask BizMind AI Copilot anything about revenue, customers, churn, or scenarios..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 text-xs py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
        </form>
      </div>
    </div>
  );
}
