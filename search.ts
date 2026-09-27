import { Router, Response } from 'express';
import { db } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const query = String(req.query.q || '').trim().toLowerCase();
  if (!query) {
    res.json({ results: { customers: [], products: [], reports: [], scenarios: [], tickets: [] } });
    return;
  }

  const businessId = req.user!.businessId;
  const customers = db.getCustomers(businessId);
  const products = db.getProducts(businessId);
  const reports = db.getReports(businessId);
  const scenarios = db.getScenarios(businessId);
  const tickets = db.getSupportTickets(businessId);

  const matchedCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.email.toLowerCase().includes(query) ||
    c.company.toLowerCase().includes(query) ||
    c.segment.toLowerCase().includes(query)
  ).slice(0, 6);

  const matchedProducts = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  ).slice(0, 6);

  const matchedReports = reports.filter(r =>
    r.title.toLowerCase().includes(query) ||
    r.type.toLowerCase().includes(query) ||
    r.summary.toLowerCase().includes(query)
  ).slice(0, 6);

  const matchedScenarios = scenarios.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.description.toLowerCase().includes(query)
  ).slice(0, 6);

  const matchedTickets = tickets.filter(t =>
    t.ticketNumber.toLowerCase().includes(query) ||
    t.subject.toLowerCase().includes(query) ||
    t.message.toLowerCase().includes(query) ||
    t.category.toLowerCase().includes(query)
  ).slice(0, 6);

  res.json({
    query,
    totalMatches:
      matchedCustomers.length +
      matchedProducts.length +
      matchedReports.length +
      matchedScenarios.length +
      matchedTickets.length,
    results: {
      customers: matchedCustomers,
      products: matchedProducts,
      reports: matchedReports,
      scenarios: matchedScenarios,
      tickets: matchedTickets,
    },
  });
});

export default router;
