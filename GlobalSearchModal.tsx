import { useState, useEffect } from 'react';
import { Search, X, Users, Package, FileText, GitBranch, LifeBuoy, ArrowRight, Loader2 } from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { api } from '../../services/api';

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, navigateTo, setActiveTicketId } = useBusiness();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    customers: any[];
    products: any[];
    reports: any[];
    scenarios: any[];
    tickets: any[];
  }>({ customers: [], products: [], reports: [], scenarios: [], tickets: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ customers: [], products: [], reports: [], scenarios: [], tickets: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query.trim());
        setResults(res.results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const totalHits =
    results.customers.length +
    results.products.length +
    results.reports.length +
    results.scenarios.length +
    results.tickets.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search customers, products, reports, scenarios, tickets..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-400"
          />
          {loading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4 text-xs">
          {!query && (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              Type keywords to search across your entire business ecosystem.
            </div>
          )}

          {query && totalHits === 0 && !loading && (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              No results found for &ldquo;<span className="font-semibold text-slate-600 dark:text-slate-300">{query}</span>&rdquo;.
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Customers ({results.customers.length})
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                {results.customers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigateTo('customers');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{c.company} · {c.segment}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                Products & Services ({results.products.length})
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                {results.products.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      navigateTo('sales');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{p.category} · ₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports */}
          {results.reports.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                Reports ({results.reports.length})
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                {results.reports.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      navigateTo('reports');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{r.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">{r.type} · {r.period}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scenarios */}
          {results.scenarios.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <GitBranch className="w-3.5 h-3.5 text-amber-600" />
                Scenarios ({results.scenarios.length})
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                {results.scenarios.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      navigateTo('scenarios-compare');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{s.name}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-md">{s.description}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Tickets */}
          {results.tickets.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
                Support Tickets ({results.tickets.length})
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                {results.tickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTicketId(t.id);
                      navigateTo('tickets');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{t.ticketNumber}: {t.subject}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">Status: {t.status} · Priority: {t.priority}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
