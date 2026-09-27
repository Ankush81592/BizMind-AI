import { Router, Response } from 'express';
import { db } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// Sales Analytics
router.get('/sales', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const sales = db.getSales(businessId);
  const products = db.getProducts(businessId);

  const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalUnits = sales.reduce((acc, s) => acc + s.units, 0);
  const avgDealSize = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  // Monthly breakdown
  const monthlyMap = new Map<string, { month: string; amount: number; units: number; count: number }>();
  sales.forEach(s => {
    const entry = monthlyMap.get(s.month) || { month: s.month, amount: 0, units: 0, count: 0 };
    entry.amount += s.amount;
    entry.units += s.units;
    entry.count += 1;
    monthlyMap.set(s.month, entry);
  });

  // Channel breakdown
  const channelMap = new Map<string, number>();
  sales.forEach(s => {
    channelMap.set(s.channel, (channelMap.get(s.channel) || 0) + s.amount);
  });

  // Product breakdown
  const productMap = new Map<string, { name: string; revenue: number; units: number }>();
  sales.forEach(s => {
    const entry = productMap.get(s.product) || { name: s.product, revenue: 0, units: 0 };
    entry.revenue += s.amount;
    entry.units += s.units;
    productMap.set(s.product, entry);
  });

  // Region breakdown
  const regionMap = new Map<string, number>();
  sales.forEach(s => {
    regionMap.set(s.region, (regionMap.get(s.region) || 0) + s.amount);
  });

  res.json({
    kpis: {
      totalRevenue,
      totalUnits,
      totalTransactions: sales.length,
      avgDealSize,
      conversionRate: 24.8, // % lead to closed sale
    },
    monthlySales: Array.from(monthlyMap.values()),
    channelPerformance: Array.from(channelMap.entries()).map(([channel, revenue]) => ({ channel, revenue })),
    productPerformance: Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue),
    regionDistribution: Array.from(regionMap.entries()).map(([region, revenue]) => ({ region, revenue })),
    recentTransactions: sales.slice(-20).reverse(),
  });
});

// Finance Analytics
router.get('/finance', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const sales = db.getSales(businessId);
  const expenses = db.getExpenses(businessId);

  const totalRevenue = sales.reduce((acc, s) => acc + s.amount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const netMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100 * 10) / 10 : 0;

  // Monthly trends
  const monthSet = new Set<string>();
  sales.forEach(s => monthSet.add(s.month));
  expenses.forEach(e => monthSet.add(e.month));

  const monthlyFlow = Array.from(monthSet).map(month => {
    const mRev = sales.filter(s => s.month === month).reduce((a, b) => a + b.amount, 0);
    const mExp = expenses.filter(e => e.month === month).reduce((a, b) => a + b.amount, 0);
    return {
      month,
      revenue: mRev,
      expenses: mExp,
      netCashFlow: mRev - mExp,
      marginPct: mRev > 0 ? Math.round(((mRev - mExp) / mRev) * 100) : 0,
    };
  });

  // Expense breakdown by category
  const categoryMap = new Map<string, number>();
  expenses.forEach(e => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });

  // Expense breakdown by department
  const deptMap = new Map<string, number>();
  expenses.forEach(e => {
    deptMap.set(e.department, (deptMap.get(e.department) || 0) + e.amount);
  });

  const latestMonthExp = monthlyFlow[monthlyFlow.length - 1]?.expenses || 800000;
  const estimatedCashReserves = 4800000; // ~48 Lakhs reserve
  const runwayMonths = latestMonthExp > 0 ? Math.round((estimatedCashReserves / latestMonthExp) * 10) / 10 : 12;

  res.json({
    kpis: {
      totalRevenue,
      totalExpenses,
      netProfit,
      netMargin,
      estimatedCashReserves,
      runwayMonths,
      burnRateMonthly: latestMonthExp,
    },
    monthlyCashFlow: monthlyFlow,
    expenseByCategory: Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      pct: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    })),
    expenseByDepartment: Array.from(deptMap.entries()).map(([department, amount]) => ({
      department,
      amount,
      pct: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    })),
    recentExpenses: expenses.slice(-20).reverse(),
  });
});

// Customer Analytics
router.get('/customers', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const customers = db.getCustomers(businessId);

  const total = customers.length;
  const active = customers.filter(c => c.status === 'Active').length;
  const atRisk = customers.filter(c => c.status === 'At Risk' || c.churnRisk === 'High').length;
  const churned = customers.filter(c => c.status === 'Churned').length;

  const avgLtv = total > 0 ? Math.round(customers.reduce((acc, c) => acc + c.ltv, 0) / total) : 0;
  const avgCac = total > 0 ? Math.round(customers.reduce((acc, c) => acc + c.cac, 0) / total) : 0;
  const ltvCacRatio = avgCac > 0 ? Math.round((avgLtv / avgCac) * 10) / 10 : 4.5;

  // Segment breakdown
  const segments = [
    { segment: 'Enterprise', count: customers.filter(c => c.segment === 'Enterprise').length, revenueContributionPct: 68 },
    { segment: 'Mid-Market', count: customers.filter(c => c.segment === 'Mid-Market').length, revenueContributionPct: 24 },
    { segment: 'SMB', count: customers.filter(c => c.segment === 'SMB').length, revenueContributionPct: 8 },
  ];

  // Churn risk distribution
  const churnRiskDist = [
    { risk: 'Low Risk', count: customers.filter(c => c.churnRisk === 'Low').length, color: '#10B981' },
    { risk: 'Medium Risk', count: customers.filter(c => c.churnRisk === 'Medium').length, color: '#F59E0B' },
    { risk: 'High Risk', count: customers.filter(c => c.churnRisk === 'High').length, color: '#EF4444' },
  ];

  res.json({
    kpis: {
      totalCustomers: total,
      activeCustomers: active,
      atRiskCustomers: atRisk,
      churnedCustomers: churned,
      retentionRate: total > 0 ? Math.round(((total - churned) / total) * 100 * 10) / 10 : 96.2,
      avgLtv,
      avgCac,
      ltvCacRatio,
    },
    segments,
    churnRiskDist,
    customers,
  });
});

// Employee Analytics
router.get('/employees', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const employees = db.getEmployees(businessId);
  const sales = db.getSales(businessId);

  const totalHeadcount = employees.length;
  const totalPayroll = employees.reduce((acc, e) => acc + e.salary, 0);
  const avgSalary = totalHeadcount > 0 ? Math.round(totalPayroll / totalHeadcount) : 0;

  // 12 months average monthly revenue
  const totalRev = sales.reduce((acc, s) => acc + s.amount, 0);
  const monthlyAvgRev = sales.length > 0 ? Math.round(totalRev / 12) : 1200000;
  const revenuePerEmployee = totalHeadcount > 0 ? Math.round(monthlyAvgRev / totalHeadcount) : 0;

  // Department breakdown
  const deptMap = new Map<string, { count: number; totalSalary: number }>();
  employees.forEach(e => {
    const entry = deptMap.get(e.department) || { count: 0, totalSalary: 0 };
    entry.count += 1;
    entry.totalSalary += e.salary;
    deptMap.set(e.department, entry);
  });

  const departmentBreakdown = Array.from(deptMap.entries()).map(([department, data]) => ({
    department,
    count: data.count,
    totalSalary: data.totalSalary,
    avgSalary: Math.round(data.totalSalary / data.count),
  }));

  const avgPerformance = totalHeadcount > 0
    ? Math.round((employees.reduce((acc, e) => acc + e.performanceScore, 0) / totalHeadcount) * 10) / 10
    : 8.8;

  res.json({
    kpis: {
      totalHeadcount,
      totalMonthlyPayroll: totalPayroll,
      avgSalary,
      revenuePerEmployee,
      avgPerformanceScore: avgPerformance,
    },
    departmentBreakdown,
    employees,
  });
});

export default router;
