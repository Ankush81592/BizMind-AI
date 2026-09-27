import { Router, Response } from 'express';
import { db, ScenarioRecord } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// Simulation engine calculation
function runSimulation(params: {
  baselineRevenue: number;
  baselineExpenses: number;
  baselineCustomers: number;
  priceChangePct: number;
  marketingBudgetChangePct: number;
  employeeChangeCount: number;
  avgSalary: number;
  salesGrowthPct: number;
  churnChangePct: number;
  operatingExpenseChangePct: number;
}) {
  const {
    baselineRevenue,
    baselineExpenses,
    baselineCustomers,
    priceChangePct,
    marketingBudgetChangePct,
    employeeChangeCount,
    avgSalary,
    salesGrowthPct,
    churnChangePct,
    operatingExpenseChangePct,
  } = params;

  // Elasticity models:
  // Price change impacts revenue with slight price elasticity of demand (-0.2)
  const priceElasticity = -0.2;
  const volumeImpactFromPrice = (priceChangePct * priceElasticity) / 100;
  const netPriceEffect = (priceChangePct / 100) * (1 + volumeImpactFromPrice);

  // Marketing spend change impacts lead generation & new sales (elasticity ~0.4)
  const marketingEffect = (marketingBudgetChangePct / 100) * 0.42;

  // Additional sales growth slider
  const directSalesGrowth = salesGrowthPct / 100;

  // Churn change impact on revenue (churn reduction of 1% adds ~0.8% retention revenue)
  const churnEffect = -(churnChangePct / 100) * 0.8;

  // Total revenue multiplier
  const totalRevMultiplier = 1 + netPriceEffect + marketingEffect + directSalesGrowth + churnEffect;
  const simulatedRevenue = Math.max(0, Math.round(baselineRevenue * totalRevMultiplier));

  // Expense adjustments:
  // Baseline payroll assumes ~50% of expenses
  const basePayroll = baselineExpenses * 0.50;
  const baseMarketing = baselineExpenses * 0.18;
  const baseOtherOps = baselineExpenses * 0.32;

  // Employee additions
  const newPayrollDelta = employeeChangeCount * avgSalary;
  const newMarketingDelta = baseMarketing * (marketingBudgetChangePct / 100);
  const newOtherOpsDelta = baseOtherOps * (operatingExpenseChangePct / 100);

  const simulatedExpenses = Math.max(0, Math.round(baselineExpenses + newPayrollDelta + newMarketingDelta + newOtherOpsDelta));
  const baselineProfit = baselineRevenue - baselineExpenses;
  const simulatedProfit = simulatedRevenue - simulatedExpenses;

  // Customer count simulation
  const customerGrowthNet = (marketingEffect * 1.2 + directSalesGrowth * 0.8 - (churnChangePct / 100));
  const simulatedCustomers = Math.max(1, Math.round(baselineCustomers * (1 + customerGrowthNet)));

  const revenueDiff = simulatedRevenue - baselineRevenue;
  const revenuePct = baselineRevenue > 0 ? Math.round((revenueDiff / baselineRevenue) * 100 * 10) / 10 : 0;

  const expenseDiff = simulatedExpenses - baselineExpenses;
  const expensePct = baselineExpenses > 0 ? Math.round((expenseDiff / baselineExpenses) * 100 * 10) / 10 : 0;

  const profitDiff = simulatedProfit - baselineProfit;
  const profitPct = baselineProfit !== 0 ? Math.round((profitDiff / Math.abs(baselineProfit)) * 100 * 10) / 10 : 0;

  const customerDiff = simulatedCustomers - baselineCustomers;

  // Health score impact estimate
  const baseHealth = 78;
  let healthDelta = 0;
  if (simulatedProfit > baselineProfit) healthDelta += 4;
  if (simulatedProfit / simulatedRevenue > baselineProfit / baselineRevenue) healthDelta += 3;
  if (customerDiff > 0) healthDelta += 2;
  if (simulatedExpenses > baselineExpenses * 1.25) healthDelta -= 3;
  const simulatedHealth = Math.min(99, Math.max(40, baseHealth + healthDelta));

  return {
    baseline: {
      revenue: baselineRevenue,
      expenses: baselineExpenses,
      profit: baselineProfit,
      customers: baselineCustomers,
      healthScore: baseHealth,
    },
    simulated: {
      revenue: simulatedRevenue,
      expenses: simulatedExpenses,
      profit: simulatedProfit,
      customers: simulatedCustomers,
      healthScore: simulatedHealth,
    },
    delta: {
      revenueDiff,
      revenuePct,
      expenseDiff,
      expensePct,
      profitDiff,
      profitPct,
      customerDiff,
    },
  };
}

// Simulate (without saving)
router.post('/simulate', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const sales = db.getSales(businessId);
  const expenses = db.getExpenses(businessId);
  const customers = db.getCustomers(businessId);

  // Group latest month or use defaults
  const totalRev = sales.reduce((a, b) => a + b.amount, 0);
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  const monthlyRevenue = sales.length > 0 ? Math.round(totalRev / 12) : 1450000;
  const monthlyExpenses = expenses.length > 0 ? Math.round(totalExp / 12) : 890000;
  const currentCustomers = customers.length || 84;

  const {
    priceChangePct = 0,
    marketingBudgetChangePct = 0,
    employeeChangeCount = 0,
    avgSalary = 115000,
    salesGrowthPct = 0,
    churnChangePct = 0,
    operatingExpenseChangePct = 0,
  } = req.body;

  const result = runSimulation({
    baselineRevenue: Number(req.body.baselineRevenue) || monthlyRevenue,
    baselineExpenses: Number(req.body.baselineExpenses) || monthlyExpenses,
    baselineCustomers: Number(req.body.baselineCustomers) || currentCustomers,
    priceChangePct: Number(priceChangePct),
    marketingBudgetChangePct: Number(marketingBudgetChangePct),
    employeeChangeCount: Number(employeeChangeCount),
    avgSalary: Number(avgSalary),
    salesGrowthPct: Number(salesGrowthPct),
    churnChangePct: Number(churnChangePct),
    operatingExpenseChangePct: Number(operatingExpenseChangePct),
  });

  res.json({
    simulation: result,
    disclaimer: 'Notice: Projections are derived from economic elasticity algorithms and historical business baselines. They represent scenario estimations, not financial guarantees.',
  });
});

// List saved scenarios
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const scenarios = db.getScenarios(businessId);
  res.json({ scenarios });
});

// Save scenario
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId;
    const {
      name,
      description,
      parameters,
      baseline,
      simulated,
      delta,
    } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Scenario title is required.' });
      return;
    }

    const scenario: ScenarioRecord = {
      id: `scen_${Date.now()}`,
      businessId,
      name,
      description: description || 'Custom what-if simulation model.',
      parameters: parameters || {
        priceChangePct: 0,
        marketingBudgetChangePct: 0,
        employeeChangeCount: 0,
        avgSalary: 115000,
        salesGrowthPct: 0,
        churnChangePct: 0,
        operatingExpenseChangePct: 0,
      },
      baseline: baseline || { revenue: 1450000, expenses: 890000, profit: 560000, customers: 84, healthScore: 78 },
      simulated: simulated || { revenue: 1450000, expenses: 890000, profit: 560000, customers: 84, healthScore: 78 },
      delta: delta || { revenueDiff: 0, revenuePct: 0, expenseDiff: 0, expensePct: 0, profitDiff: 0, profitPct: 0, customerDiff: 0 },
      isSaved: true,
      createdAt: new Date().toISOString(),
    };

    db.addScenario(scenario);
    res.status(201).json({ message: 'Scenario saved successfully.', scenario });
  } catch (err: unknown) {
    console.error('Save scenario error:', err);
    res.status(500).json({ error: 'Failed to save scenario.' });
  }
});

// Duplicate scenario
router.post('/:id/duplicate', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const scenario = db.getScenarios(businessId).find(s => s.id === req.params.id);
  if (!scenario) {
    res.status(404).json({ error: 'Scenario not found.' });
    return;
  }

  const dup: ScenarioRecord = {
    ...scenario,
    id: `scen_${Date.now()}`,
    name: `${scenario.name} (Copy)`,
    createdAt: new Date().toISOString(),
  };

  db.addScenario(dup);
  res.status(201).json({ message: 'Scenario duplicated.', scenario: dup });
});

// Delete scenario
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const success = db.deleteScenario(req.params.id, businessId);
  if (!success) {
    res.status(404).json({ error: 'Scenario not found.' });
    return;
  }
  res.json({ message: 'Scenario deleted successfully.' });
});

export default router;
