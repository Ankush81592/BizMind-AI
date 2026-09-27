import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  LifeBuoy,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  User,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SupportTicket, SupportMessage } from '../types';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const loadAllTickets = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminTickets();
      setTickets(res.tickets || []);
      if (res.tickets && res.tickets.length > 0 && !selectedTicket) {
        openTicket(res.tickets[0]);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback for demo users
      try {
        const userTickets = await api.getTickets();
        setTickets(userTickets.tickets || []);
        if (userTickets.tickets.length > 0) openTicket(userTickets.tickets[0]);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const openTicket = async (t: SupportTicket) => {
    setSelectedTicket(t);
    try {
      const res = await api.getTicketDetails(t.id);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAllTickets();
  }, []);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      const res = await api.updateAdminTicket(selectedTicket.id, { status: newStatus });
      setSelectedTicket(res.ticket);
      setTickets(prev => prev.map(t => (t.id === selectedTicket.id ? res.ticket : t)));
    } catch (err: any) {
      alert(err.message || 'Failed to update ticket status.');
    }
  };

  const handleUpdatePriority = async (newPriority: string) => {
    if (!selectedTicket) return;
    try {
      const res = await api.updateAdminTicket(selectedTicket.id, { priority: newPriority });
      setSelectedTicket(res.ticket);
      setTickets(prev => prev.map(t => (t.id === selectedTicket.id ? res.ticket : t)));
    } catch (err: any) {
      alert(err.message || 'Failed to update priority.');
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.postTicketMessage(selectedTicket.id, replyText.trim());
      setMessages(prev => [...prev, res.newMessage]);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to post reply.');
    } finally {
      setSending(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || t.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Support & Operations Desk</h2>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Queue</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Triage, resolve, and reply to client inquiries across all businesses
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tickets, IDs, or users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Only</option>
            <option value="in progress">In Progress</option>
            <option value="waiting for user">Waiting for User</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Column: Tickets Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 overflow-y-auto max-h-[620px] transition-colors">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pb-1 flex justify-between">
            <span>Ticket Queue ({filteredTickets.length})</span>
            <span>Total: {tickets.length}</span>
          </div>

          {filteredTickets.map(t => (
            <div
              key={t.id}
              onClick={() => openTicket(t)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedTicket?.id === t.id
                  ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono font-bold text-purple-700 dark:text-purple-400">{t.ticketNumber}</span>
                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {t.status}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{t.subject}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                From: <span className="font-medium text-slate-700 dark:text-slate-300">{t.name}</span> ({t.email})
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                <span className="font-semibold text-rose-600 dark:text-rose-400">Priority: {t.priority}</span>
                <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Ticket Detail & Admin Reply Box (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
          {selectedTicket ? (
            <>
              {/* Header with Admin Status Controls */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                        {selectedTicket.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{selectedTicket.subject}</h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      User: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTicket.name}</span> ({selectedTicket.email})
                    </div>
                  </div>

                  {/* Status / Priority update dropdowns */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Status</span>
                      <select
                        value={selectedTicket.status}
                        onChange={e => handleUpdateStatus(e.target.value)}
                        className="py-1 px-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-semibold text-slate-800 dark:text-white"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting for User">Waiting for User</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Priority</span>
                      <select
                        value={selectedTicket.priority}
                        onChange={e => handleUpdatePriority(e.target.value)}
                        className="py-1 px-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-semibold text-slate-800 dark:text-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages timeline */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[360px] bg-slate-50/40 dark:bg-slate-950/20">
                {messages.map(m => {
                  const isStaff = m.senderRole === 'support' || m.senderRole === 'admin';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 text-xs ${isStaff ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isStaff && (
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-xl rounded-2xl p-4 shadow-2xs ${
                          isStaff
                            ? 'bg-purple-900 text-white rounded-tr-xs'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-bold mb-1 ${
                            isStaff ? 'text-purple-200' : 'text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          {m.senderName}
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">{m.message}</p>
                        <div
                          className={`text-[9px] mt-1.5 ${
                            isStaff ? 'text-purple-300 text-right' : 'text-slate-400'
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {isStaff && (
                        <div className="w-8 h-8 rounded-lg bg-purple-950 text-white flex items-center justify-center shrink-0 border border-purple-800">
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Admin Reply Box */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSendAdminReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reply as Support Administrator to the user..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    disabled={sending}
                    className="flex-1 text-xs py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Post Reply</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 my-auto">
              Select a support ticket to review and manage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
