import { Router, Response } from 'express';
import { db, SupportTicketRecord, SupportMessageRecord } from '../db.js';
import { authMiddleware, adminOnlyMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// Exact support contact info constants
export const SUPPORT_CONTACT = {
  email: 'gbd9109@gmail.com',
  phone: '+91 8988542477',
  whatsapp: '+91 7590081172',
  emailMailto: 'mailto:gbd9109@gmail.com?subject=BizMind%20AI%20Support%20Request',
  callTel: 'tel:+918988542477',
  whatsappUrl: 'https://wa.me/917590081172?text=Hello%20BizMind%20AI%20Support%2C%20I%20need%20assistance%20with%20my%20account.',
};

// Get support contact info & user's tickets
router.get('/info', (req, res) => {
  res.json({ contact: SUPPORT_CONTACT });
});

// Get user tickets
router.get('/tickets', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const tickets = db.getSupportTickets(businessId);
  res.json({ tickets });
});

// Create new support ticket
router.post('/tickets', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { category, priority, subject, message, name, email } = req.body;
    const user = req.user!;

    if (!subject || !message) {
      res.status(400).json({ error: 'Subject and message are required.' });
      return;
    }

    const ticketSeq = Math.floor(100000 + Math.random() * 900000);
    const ticketNumber = `BM-2026-${ticketSeq}`;
    const ticketId = `tkt_${Date.now()}`;

    const newTicket: SupportTicketRecord = {
      id: ticketId,
      ticketNumber,
      userId: user.id,
      businessId: user.businessId,
      name: name || user.name,
      email: email || user.email,
      category: category || 'Technical Issue',
      priority: priority || 'Medium',
      subject,
      message,
      status: 'Open',
      assignedTo: 'BizMind Support Queue',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.addSupportTicket(newTicket);

    // Initial message in thread
    const initialMsg: SupportMessageRecord = {
      id: `msg_${Date.now()}`,
      ticketId,
      senderRole: 'user',
      senderName: user.name,
      message,
      createdAt: new Date().toISOString(),
    };
    db.addSupportMessage(initialMsg);

    // Add user notification
    db.addNotification({
      id: `notif_tkt_${Date.now()}`,
      businessId: user.businessId,
      type: 'ticket_created',
      title: `Support Ticket ${ticketNumber} Logged`,
      message: `Your ticket regarding "${subject}" is submitted. Our support specialists at +91 8988542477 are reviewing it.`,
      severity: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Support ticket submitted successfully.',
      ticket: newTicket,
    });
  } catch (err: unknown) {
    console.error('Create ticket error:', err);
    res.status(500).json({ error: 'Failed to create support ticket.' });
  }
});

// Get single ticket details and conversation thread
router.get('/tickets/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const ticket = db.getTicketById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found.' });
    return;
  }

  // Security check: users only access their own business's tickets, unless admin
  if (req.user!.role !== 'admin' && ticket.businessId !== req.user!.businessId) {
    res.status(403).json({ error: 'Unauthorized to view this ticket.' });
    return;
  }

  const messages = db.getSupportMessages(ticket.id);
  res.json({ ticket, messages });
});

// Post a message in the ticket thread
router.post('/tickets/:id/messages', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { message, attachmentUrl } = req.body;
    const user = req.user!;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const ticket = db.getTicketById(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found.' });
      return;
    }

    if (user.role !== 'admin' && ticket.businessId !== user.businessId) {
      res.status(403).json({ error: 'Unauthorized to reply to this ticket.' });
      return;
    }

    const senderRole = user.role === 'admin' ? 'support' : 'user';
    const newMsg: SupportMessageRecord = {
      id: `msg_${Date.now()}`,
      ticketId: ticket.id,
      senderRole,
      senderName: user.name + (user.role === 'admin' ? ' (Support Lead)' : ''),
      message,
      attachmentUrl,
      createdAt: new Date().toISOString(),
    };

    db.addSupportMessage(newMsg);

    // If user replies, update status if closed/resolved
    if (user.role === 'user' && (ticket.status === 'Resolved' || ticket.status === 'Closed')) {
      db.updateSupportTicket(ticket.id, { status: 'In Progress' });
    } else if (user.role === 'admin' && ticket.status === 'Open') {
      db.updateSupportTicket(ticket.id, { status: 'In Progress' });
    }

    res.status(201).json({ message: 'Message sent successfully.', newMessage: newMsg });
  } catch (err: unknown) {
    console.error('Post support message error:', err);
    res.status(500).json({ error: 'Failed to post message.' });
  }
});

// --- ADMIN / SUPPORT DASHBOARD ENDPOINTS ---

// Admin: Get all tickets
router.get('/admin/all-tickets', authMiddleware, adminOnlyMiddleware, (req: AuthRequest, res: Response) => {
  const tickets = db.getAllSupportTickets();
  res.json({ tickets });
});

// Admin: Update ticket status, priority, or assignment
router.put('/admin/tickets/:id', authMiddleware, adminOnlyMiddleware, (req: AuthRequest, res: Response) => {
  const { status, priority, assignedTo } = req.body;
  const ticket = db.getTicketById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found.' });
    return;
  }

  const updated = db.updateSupportTicket(ticket.id, {
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(assignedTo ? { assignedTo } : {}),
  });

  // Notify business user of status update
  if (status && status !== ticket.status) {
    db.addNotification({
      id: `notif_stat_${Date.now()}`,
      businessId: ticket.businessId,
      type: 'ticket_status_change',
      title: `Ticket ${ticket.ticketNumber} Updated: ${status}`,
      message: `Support team has updated the status of your ticket "${ticket.subject}" to ${status}.`,
      severity: status === 'Resolved' ? 'success' : 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  res.json({ message: 'Ticket updated successfully.', ticket: updated });
});

export default router;
