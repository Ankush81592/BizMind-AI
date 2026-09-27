import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  LifeBuoy,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/BusinessContext';
import { api } from '../services/api';

export function SupportCenterPage() {
  const { user } = useAuth();
  const { navigateTo, setActiveTicketId } = useBusiness();

  // Contact details strictly matching instructions (Section 17 & 35)
  const contactInfo = {
    email: 'gbd9109@gmail.com',
    phone: '+91 8988542477',
    whatsapp: '+91 7590081172',
  };

  const mailtoLink = `mailto:${contactInfo.email}?subject=BizMind%20AI%20Support%20Request&body=User:%20${encodeURIComponent(
    user?.name || ''
  )}%0AEmail:%20${encodeURIComponent(user?.email || '')}%0ABusiness:%20${encodeURIComponent(
    user?.businessName || ''
  )}%0A%0APlease%20describe%20your%20issue:`;

  const phoneLink = `tel:+918988542477`;

  const whatsappLink = `https://wa.me/917590081172?text=${encodeURIComponent(
    'Hello BizMind AI Support, I need assistance with my account.'
  )}`;

  // Ticket Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'Technical Issue',
    priority: 'Medium',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      setError('Please provide both subject and message.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createTicket(formData);
      setCreatedTicket(res.ticket);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        category: 'Technical Issue',
        priority: 'Medium',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">BizMind Help Desk & Support Center</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Reach our dedicated technical engineers directly or submit an enterprise support ticket
        </p>
      </div>

      {/* Direct Contact Channels (Section 17 & 35) */}
      <div>
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Need Help? Direct Contact Channels
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Email Support Card */}
          <a
            href={mailtoLink}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Support</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {contactInfo.email}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Opens your default mail client with pre-filled business diagnostics.
              </p>
            </div>
            <div className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Send Email Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Call Support Card */}
          <a
            href={phoneLink}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Call Support</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {contactInfo.phone}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Direct hotline to speak with a dedicated operations specialist.
              </p>
            </div>
            <div className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Call Helpline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* WhatsApp Support Card */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-green-500 dark:hover:border-green-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WhatsApp Support</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {contactInfo.whatsapp}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Instant chat via WhatsApp with pre-filled support greeting.
              </p>
            </div>
            <div className="mt-4 text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
              <span>Open WhatsApp Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </div>

      {/* Internal Support Ticket Submission Form (Section 18) */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Submit Enterprise Support Ticket</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Generates a unique tracking ID (BM-2026-XXXXXX) stored directly in the database
            </p>
          </div>

          <button
            onClick={() => navigateTo('tickets')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All My Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {createdTicket && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Your support request has been submitted successfully.</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Ticket ID: <span className="font-bold text-slate-900 dark:text-white font-mono">{createdTicket.ticketNumber}</span> ·
              Status: <span className="font-bold text-emerald-700 dark:text-emerald-400">{createdTicket.status}</span>
            </p>
            <button
              onClick={() => {
                setActiveTicketId(createdTicket.id);
                navigateTo('tickets');
              }}
              className="mt-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold transition-colors cursor-pointer"
            >
              Open Ticket Conversation Thread →
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Account">Account Management</option>
                <option value="Billing">Billing & Subscription</option>
                <option value="AI Features">AI Agents & Copilot Features</option>
                <option value="Data Import">Data Import & Schema Sync</option>
                <option value="Dashboard">Dashboard Metrics & Charts</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Urgency Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low - General Feedback</option>
                <option value="Medium">Medium - Normal Operational Query</option>
                <option value="High">High - Impaired System Functionality</option>
                <option value="Critical">Critical - Production Down / Data Blocker</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of the inquiry or problem"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                placeholder="Please describe the steps to reproduce or questions for our specialists..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
