import React, { useState, useEffect, useRef } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { SupportTicket, SupportMessage } from '../types';

export function SupportTicketsPage() {
  const { navigateTo, activeTicketId, setActiveTicketId } = useBusiness();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await api.getTickets();
      setTickets(res.tickets || []);

      if (activeTicketId) {
        const found = res.tickets.find((t: any) => t.id === activeTicketId || t.ticketNumber === activeTicketId);
        if (found) {
          openTicket(found);
          return;
        }
      }

      if (res.tickets && res.tickets.length > 0 && !selectedTicket) {
        openTicket(res.tickets[0]);
      }
    } catch (err) {
      console.error(err);
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
    loadTickets();
  }, [activeTicketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.postTicketMessage(selectedTicket.id, replyText.trim());
      setMessages(prev => [...prev, res.newMessage]);
      setReplyText('');
    } catch (err: any) {
      alert(err.message || 'Failed to post message.');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Waiting for User':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Support Ticket Desk</h2>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              {tickets.length} Tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track inquiries, bug reports, and chat directly with assigned support specialists
          </p>
        </div>

        <button
          onClick={() => navigateTo('support')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="p-12 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <LifeBuoy className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Support Tickets Logged</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            If you need assistance with data ingestion or system features, log a ticket anytime.
          </p>
          <button
            onClick={() => navigateTo('support')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Create Ticket Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          {/* Ticket List (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 overflow-y-auto max-h-[600px] transition-colors">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 pb-1">
              Active Ticket Roster
            </div>

            {tickets.map(t => (
              <div
                key={t.id}
                onClick={() => openTicket(t)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTicket?.id === t.id
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{t.ticketNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>

                <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{t.subject}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                  <span>Priority: {t.priority}</span>
                  <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Ticket Conversation Thread (8 cols) (Section 19) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
            {selectedTicket ? (
              <>
                {/* Header */}
                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{selectedTicket.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                        {selectedTicket.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{selectedTicket.subject}</h3>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Submitted by {selectedTicket.name} · Assigned to: {selectedTicket.assignedTo || 'BizMind Support Queue'}
                    </div>
                  </div>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[380px] bg-slate-50/30 dark:bg-slate-950/20">
                  {messages.map(m => {
                    const isSupport = m.senderRole === 'support' || m.senderRole === 'admin';
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 text-xs ${isSupport ? 'justify-start' : 'justify-end'}`}
                      >
                        {isSupport && (
                          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 border border-slate-700">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                          </div>
                        )}

                        <div
                          className={`max-w-xl rounded-2xl p-4 shadow-2xs ${
                            isSupport
                              ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                              : 'bg-blue-600 text-white rounded-tr-xs'
                          }`}
                        >
                          <div
                            className={`text-[10px] font-bold mb-1 ${
                              isSupport ? 'text-blue-700 dark:text-blue-400' : 'text-blue-100'
                            }`}
                          >
                            {m.senderName}
                          </div>
                          <p className="leading-relaxed whitespace-pre-line">{m.message}</p>
                          <div
                            className={`text-[9px] mt-1.5 ${
                              isSupport ? 'text-slate-400 dark:text-slate-400' : 'text-blue-200'
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        {!isSupport && (
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Box */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                  <form onSubmit={handleSendReply} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type your response to the support specialist..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      disabled={sending}
                      className="flex-1 text-xs py-2.5 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={sending || !replyText.trim()}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send Reply</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 my-auto">
                Select a ticket on the left to read and reply to messages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
