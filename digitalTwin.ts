import { Router, Response } from 'express';
import { db } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

export function calculateDigitalTwinHealth(businessId: string) {
  const sales = db.getSales(businessId);
  const expenses = db.getExpenses(businessId);
  const customers = db.getCustomers(businessId);
  const employees = db.getEmployees(businessId);
  const products = db.getProducts(businessId);
  const campaigns = db.getCampaigns(businessId);

  const totalRev = sales.reduce((a, b) => a + b.amount, 0);
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  const netProfit = totalRev - totalExp;
  const netMarginPct = totalRev > 0 ? (netProfit / totalRev) * 100 : 0;

  // 1. Financial Health (weight 25%)
  // Factors: profit margin, positive cashflow
  let financialHealth = 50;
  if (netMarginPct > 35) financialHealth = 90;
  else if (netMarginPct > 25) financialHealth = 82;
  else if (netMarginPct > 15) financialHealth = 72;
  else if (netMarginPct > 0) financialHealth = 60;
  else financialHealth = 40;

  // 2. Sales Health (weight 20%)
  // Factors: transaction volume, average margin
  const avgProductMargin = products.length > 0
    ? products.reduce((a, b) => a + b.marginPct, 0) / products.length
    : 70;
  let salesHealth = Math.min(95, Math.max(50, Math.round(avgProductMargin)));

  // 3. Customer Health (weight 20%)
  // Factors: churn risk proportion, LTV:CAC
  const totalCustomers = customers.length;
  const atRisk = customers.filter(c => c.churnRisk === 'High' || c.status === 'At Risk').length;
  const churnPct = totalCustomers > 0 ? (atRisk / totalCustomers) * 100 : 5;
  let customerHealth = 85;
  if (churnPct < 5) customerHealth = 92;
  else if (churnPct < 15) customerHealth = 80;
  else if (churnPct < 30) customerHealth = 65;
  else customerHealth = 45;

  // 4. Operational Health (weight 15%)
  // Factors: recurring stability, cost concentration
  const opsExpenses = expenses.filter(e => e.department.toLowerCase().includes('oper') || e.category.toLowerCase().includes('infra'));
  const opsCostRatio = totalExp > 0 ? (opsExpenses.reduce((a, b) => a + b.amount, 0) / totalExp) * 100 : 20;
  let operationalHealth = 76;
  if (opsCostRatio < 25) operationalHealth = 85;
  else if (opsCostRatio < 40) operationalHealth = 75;
  else operationalHealth = 60;

  // 5. Marketing Health (weight 10%)
  // Factors: campaign ROI and lead conversion
  const avgCampaignRoi = campaigns.length > 0
    ? campaigns.reduce((a, b) => a + b.roi, 0) / campaigns.length
    : 4.5;
  let marketingHealth = Math.min(95, Math.max(50, Math.round(avgCampaignRoi * 16)));

  // 6. Workforce Health (weight 10%)
  // Factors: employee performance and headcount balance
  const avgEmpScore = employees.length > 0
    ? employees.reduce((a, b) => a + b.performanceScore, 0) / employees.length
    : 8.5;
  let workforceHealth = Math.min(95, Math.round(avgEmpScore * 9));

  // Overall Score (Weighted)
  const overallHealth = Math.round(
    financialHealth * 0.25 +
    salesHealth * 0.20 +
    customerHealth * 0.20 +
    operationalHealth * 0.15 +
    marketingHealth * 0.10 +
    workforceHealth * 0.10
  );

  return {
    score: overallHealth,
    breakdown: {
      financial: financialHealth,
      sales: salesHealth,
      customer: customerHealth,
      operational: operationalHealth,
      marketing: marketingHealth,
      workforce: workforceHealth,
    },
    factors: [
      { dimension: 'Financial Health', score: financialHealth, weight: '25%', detail: `Net margin of ${Math.round(netMarginPct)}% yields high liquidity resilience.` },
      { dimension: 'Sales Health', score: salesHealth, weight: '20%', detail: `Average product gross margin of ${Math.round(avgProductMargin)}% across ${products.length} catalog items.` },
      { dimension: 'Customer Health', score: customerHealth, weight: '20%', detail: `${totalCustomers - atRisk} of ${totalCustomers} active accounts with low/stable churn vulnerability.` },
      { dimension: 'Operational Health', score: operationalHealth, weight: '15%', detail: `Infrastructure and operations overhead well contained at ${Math.round(opsCostRatio)}% of total cost.` },
      { dimension: 'Marketing Health', score: marketingHealth, weight: '10%', detail: `Blended marketing campaign return of ${avgCampaignRoi.toFixed(1)}x across active channels.` },
      { dimension: 'Workforce Health', score: workforceHealth, weight: '10%', detail: `Average team performance rating of ${avgEmpScore.toFixed(1)}/10 across ${employees.length} personnel.` },
    ],
  };
}

// Get Digital Twin
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const business = db.getBusiness(businessId);
  const sales = db.getSales(businessId);
  const expenses = db.getExpenses(businessId);
  const customers = db.getCustomers(businessId);
  const employees = db.getEmployees(businessId);
  const products = db.getProducts(businessId);
  const campaigns = db.getCampaigns(businessId);

  const healthData = calculateDigitalTwinHealth(businessId);

  // Update business cached health score
  db.updateBusiness(businessId, {
    healthScore: healthData.score,
    healthBreakdown: healthData.breakdown,
  });

  const totalRev = sales.reduce((a, b) => a + b.amount, 0);
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);

  // Virtual model nodes and streams
  const virtualModel = {
    revenueStreams: [
      { name: 'Enterprise Subscriptions', share: 68, monthlyValue: Math.round(totalRev * 0.68 / 12) },
      { name: 'Mid-Market Subscriptions', share: 24, monthlyValue: Math.round(totalRev * 0.24 / 12) },
      { name: 'Custom Implementation & Add-ons', share: 8, monthlyValue: Math.round(totalRev * 0.08 / 12) },
    ],
    salesChannels: [
      { channel: 'Enterprise Direct Outbound', conversionRate: '32%', leadTimeDays: 45 },
      { channel: 'Inbound Web & Search', conversionRate: '18%', leadTimeDays: 14 },
      { channel: 'Channel & Technology Partners', conversionRate: '26%', leadTimeDays: 30 },
    ],
    costStructures: [
      { category: 'Engineering & Product Payroll', amount: Math.round(totalExp * 0.52 / 12), pct: 52 },
      { category: 'Marketing & Demand Acquisition', amount: Math.round(totalExp * 0.18 / 12), pct: 18 },
      { category: 'Cloud DevOps & Storage', amount: Math.round(totalExp * 0.14 / 12), pct: 14 },
      { category: 'Admin, Office & Legal', amount: Math.round(totalExp * 0.10 / 12), pct: 10 },
      { category: 'SaaS Tooling & Licenses', amount: Math.round(totalExp * 0.06 / 12), pct: 6 },
    ],
    inventoryAndCapacity: {
      totalProducts: products.length,
      softwareLicensesAvailable: 'Unlimited (Cloud SaaS)',
      teamCapacityUtilization: '82%',
      supportTicketTurnaroundHours: 3.4,
    },
    funnelMetrics: {
      monthlyWebsiteVisitors: 28400,
      monthlyLeadsGenerated: 1270,
      qualifiedSalesOpportunities: 185,
      newClosedDeals: 38,
      visitorToCustomerPct: 0.13,
    },
  };

  res.json({
    business: {
      id: business?.id,
      name: business?.name,
      type: business?.type,
      currency: business?.currency || 'INR',
    },
    health: healthData,
    virtualModel,
  });
});

export default router;
