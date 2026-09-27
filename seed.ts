import bcrypt from 'bcryptjs';
import { db, Business, User, SaleRecord, ExpenseRecord, CustomerRecord, EmployeeRecord, ProductRecord, MarketingCampaign, ScenarioRecord, ReportRecord, NotificationRecord, SupportTicketRecord, SupportMessageRecord } from './db.js';

export async function seedDemoData(): Promise<void> {
  const existingUser = db.findUserByEmail('demo@bizmind.ai');
  if (existingUser) {
    return; // Already seeded
  }

  console.log('Seeding initial BizMind AI database with realistic business dataset...');

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const businessId = 'biz_apex_2026';
  const userId = 'usr_demo_2026';
  const adminId = 'usr_admin_2026';

  const business: Business = {
    id: businessId,
    name: 'Apex Horizon Dynamics',
    type: 'B2B SaaS & Tech Solutions',
    currency: 'INR',
    industry: 'Enterprise Software & Cloud Services',
    targetRevenue: 15000000, // 1.5 Cr annual
    healthScore: 78,
    healthBreakdown: {
      financial: 82,
      sales: 76,
      customer: 80,
      operational: 74,
      marketing: 79,
      workforce: 77,
    },
    createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.addBusiness(business);

  const demoUser: User = {
    id: userId,
    email: 'demo@bizmind.ai',
    passwordHash,
    name: 'Vikramaditya Sharma',
    role: 'user',
    businessId,
    phone: '+91 8988542477',
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
  };
  db.addUser(demoUser);

  const adminUser: User = {
    id: adminId,
    email: 'admin@bizmind.ai',
    passwordHash,
    name: 'BizMind Support Admin',
    role: 'admin',
    businessId,
    phone: '+91 8988542477',
    createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
  };
  db.addUser(adminUser);

  // 12 Months of Sales & Expenses
  const months = [
    { label: 'Oct 2025', sales: 940000, expenses: 680000, units: 145 },
    { label: 'Nov 2025', sales: 990000, expenses: 710000, units: 158 },
    { label: 'Dec 2025', sales: 1120000, expenses: 780000, units: 172 },
    { label: 'Jan 2026', sales: 1040000, expenses: 730000, units: 160 },
    { label: 'Feb 2026', sales: 1090000, expenses: 740000, units: 168 },
    { label: 'Mar 2026', sales: 1180000, expenses: 790000, units: 185 },
    { label: 'Apr 2026', sales: 1150000, expenses: 760000, units: 178 },
    { label: 'May 2026', sales: 1220000, expenses: 810000, units: 192 },
    { label: 'Jun 2026', sales: 1280000, expenses: 830000, units: 204 },
    { label: 'Jul 2026', sales: 1310000, expenses: 840000, units: 210 },
    { label: 'Aug 2026', sales: 1390000, expenses: 860000, units: 226 },
    { label: 'Sep 2026', sales: 1450000, expenses: 890000, units: 238 },
  ];

  const salesRecords: SaleRecord[] = [];
  const expenseRecords: ExpenseRecord[] = [];

  const productsList = [
    { name: 'Apex ERP Cloud Pro', price: 45000, channel: 'Enterprise Direct' },
    { name: 'Apex Workflow Automation Suite', price: 28000, channel: 'Inbound Web' },
    { name: 'Apex AI Intelligence Add-on', price: 18000, channel: 'Upsell' },
    { name: 'Apex Security & Compliance Vault', price: 32000, channel: 'Partner Referral' },
    { name: 'Apex Custom API Integration Tier', price: 65000, channel: 'Enterprise Direct' },
  ];

  const sampleClients = [
    'Bharat Logistics Corp', 'Zenith FinTech Labs', 'Indus Retail Networks',
    'TechMahindra Ventures', 'Reliance Digital Partners', 'Tata Mobility Systems',
    'Cognitive Healthcare Ltd', 'Aegis Security Infra', 'Solaris Green Power'
  ];

  months.forEach((m, mIdx) => {
    // 5-8 sales transactions per month
    const count = 6;
    for (let i = 0; i < count; i++) {
      const prod = productsList[(mIdx + i) % productsList.length];
      const client = sampleClients[(mIdx * 2 + i) % sampleClients.length];
      const day = Math.min(28, 2 + i * 4);
      const dateStr = `2026-${String((mIdx % 12) + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      salesRecords.push({
        id: `sale_${mIdx}_${i}`,
        businessId,
        date: dateStr,
        month: m.label,
        amount: Math.round(m.sales / count + (i % 2 === 0 ? 12000 : -10000)),
        units: Math.round(m.units / count),
        product: prod.name,
        channel: prod.channel,
        customerName: client,
        region: i % 2 === 0 ? 'India - West' : 'India - North / NCR',
        status: 'Completed',
      });
    }

    // Expenses breakdown per month
    const expenseCategories = [
      { cat: 'Payroll', dept: 'Engineering & Product', share: 0.52 },
      { cat: 'Marketing', dept: 'Growth & Demand Gen', share: 0.18 },
      { cat: 'Infrastructure', dept: 'Cloud DevOps', share: 0.14 },
      { cat: 'Operations', dept: 'Admin & Office', share: 0.10 },
      { cat: 'Software', dept: 'SaaS Tooling & Licenses', share: 0.06 },
    ];

    expenseCategories.forEach((exp, eIdx) => {
      expenseRecords.push({
        id: `exp_${mIdx}_${eIdx}`,
        businessId,
        date: `2026-${String((mIdx % 12) + 1).padStart(2, '0')}-15`,
        month: m.label,
        amount: Math.round(m.expenses * exp.share),
        category: exp.cat,
        department: exp.dept,
        description: `Monthly recurring ${exp.cat.toLowerCase()} allocation for ${exp.dept}`,
        recurring: true,
      });
    });
  });

  db.addSalesBatch(salesRecords);
  db.addExpensesBatch(expenseRecords);

  // Products
  const products: ProductRecord[] = [
    { id: 'prod_1', businessId, name: 'Apex ERP Cloud Pro', category: 'Software Subscription', price: 45000, cost: 9500, stock: 999, unitsSold: 142, marginPct: 78.9 },
    { id: 'prod_2', businessId, name: 'Apex Workflow Automation Suite', category: 'Software Subscription', price: 28000, cost: 5600, stock: 999, unitsSold: 215, marginPct: 80.0 },
    { id: 'prod_3', businessId, name: 'Apex AI Intelligence Add-on', category: 'AI Services', price: 18000, cost: 4200, stock: 999, unitsSold: 184, marginPct: 76.7 },
    { id: 'prod_4', businessId, name: 'Apex Security Vault Tier', category: 'Infrastructure', price: 32000, cost: 8000, stock: 999, unitsSold: 96, marginPct: 75.0 },
    { id: 'prod_5', businessId, name: 'Apex Custom API Gateway', category: 'Enterprise Services', price: 65000, cost: 16000, stock: 999, unitsSold: 48, marginPct: 75.4 },
  ];
  products.forEach(p => db.addProduct(p));

  // Customers
  const customers: CustomerRecord[] = [
    { id: 'cust_1', businessId, name: 'Aarav Singhania', email: 'aarav@bharatlogistics.in', phone: '+91 9821034455', company: 'Bharat Logistics Corp', segment: 'Enterprise', ltv: 540000, cac: 38000, churnRisk: 'Low', status: 'Active', joinedDate: '2025-01-12', totalOrders: 12 },
    { id: 'cust_2', businessId, name: 'Pooja Deshmukh', email: 'pooja@zenithfinlabs.com', phone: '+91 9845012399', company: 'Zenith FinTech Labs', segment: 'Enterprise', ltv: 420000, cac: 32000, churnRisk: 'Low', status: 'Active', joinedDate: '2025-03-18', totalOrders: 9 },
    { id: 'cust_3', businessId, name: 'Kunal Aggarwal', email: 'kunal@indusretail.co', phone: '+91 9711099234', company: 'Indus Retail Networks', segment: 'Mid-Market', ltv: 290000, cac: 24000, churnRisk: 'Medium', status: 'Active', joinedDate: '2025-06-20', totalOrders: 6 },
    { id: 'cust_4', businessId, name: 'Sunita Reddy', email: 'sunita@techmahindra-v.in', phone: '+91 9900881122', company: 'TechMahindra Ventures', segment: 'Enterprise', ltv: 780000, cac: 45000, churnRisk: 'Low', status: 'Active', joinedDate: '2024-11-05', totalOrders: 16 },
    { id: 'cust_5', businessId, name: 'Rohan Mehra', email: 'rohan@solarispwr.com', phone: '+91 9650044321', company: 'Solaris Green Power', segment: 'Mid-Market', ltv: 210000, cac: 28000, churnRisk: 'High', status: 'At Risk', joinedDate: '2025-08-14', totalOrders: 4 },
    { id: 'cust_6', businessId, name: 'Meera Nambiar', email: 'meera@aegisinfra.net', phone: '+91 9819922001', company: 'Aegis Security Infra', segment: 'Enterprise', ltv: 610000, cac: 39000, churnRisk: 'Low', status: 'Active', joinedDate: '2025-02-10', totalOrders: 11 },
  ];
  db.addCustomersBatch(customers);

  // Employees
  const employees: EmployeeRecord[] = [
    { id: 'emp_1', businessId, name: 'Ananya Roy', role: 'Head of Engineering', department: 'Engineering', salary: 180000, performanceScore: 9.4, hireDate: '2024-03-01', status: 'Active' },
    { id: 'emp_2', businessId, name: 'Devendra Kulkarni', role: 'Senior Cloud Architect', department: 'Engineering', salary: 145000, performanceScore: 9.1, hireDate: '2024-06-15', status: 'Active' },
    { id: 'emp_3', businessId, name: 'Ritu Sen', role: 'Lead Sales Director', department: 'Sales', salary: 130000, performanceScore: 8.8, hireDate: '2024-08-01', status: 'Active' },
    { id: 'emp_4', businessId, name: 'Arjun Bansal', role: 'Senior Enterprise Account Exec', department: 'Sales', salary: 95000, performanceScore: 8.6, hireDate: '2025-01-10', status: 'Active' },
    { id: 'emp_5', businessId, name: 'Sneha Patel', role: 'Growth Marketing Manager', department: 'Marketing', salary: 85000, performanceScore: 8.9, hireDate: '2025-02-01', status: 'Active' },
    { id: 'emp_6', businessId, name: 'Farhan Zaidi', role: 'Customer Success Specialist', department: 'Operations', salary: 65000, performanceScore: 8.4, hireDate: '2025-04-15', status: 'Active' },
  ];
  employees.forEach(e => db.addEmployee(e));

  // Campaigns
  const campaigns: MarketingCampaign[] = [
    { id: 'camp_1', businessId, name: 'Q3 Enterprise Lead Generation', channel: 'LinkedIn B2B', spend: 85000, leads: 340, conversions: 28, roi: 4.8, status: 'Active' },
    { id: 'camp_2', businessId, name: 'High-Intent Search Ads', channel: 'Google Search', spend: 60000, leads: 410, conversions: 34, roi: 5.2, status: 'Active' },
    { id: 'camp_3', businessId, name: 'Industry Tech Summit Webinar Series', channel: 'Webinar / Inbound', spend: 35000, leads: 520, conversions: 42, roi: 6.1, status: 'Completed' },
  ];
  campaigns.forEach(c => db.getCampaigns(businessId).push(c));

  // Pre-configured Scenarios
  const scenarioA: ScenarioRecord = {
    id: 'scen_marketing_20',
    businessId,
    name: 'Increase Marketing Budget by 20%',
    description: 'Model the impact of raising ad spend by 20% to drive inbound pipeline and top-line growth.',
    parameters: {
      priceChangePct: 0,
      marketingBudgetChangePct: 20,
      employeeChangeCount: 0,
      avgSalary: 115000,
      salesGrowthPct: 14.5,
      churnChangePct: -1.0,
      operatingExpenseChangePct: 3.5,
    },
    baseline: {
      revenue: 1450000,
      expenses: 890000,
      profit: 560000,
      customers: 84,
      healthScore: 78,
    },
    simulated: {
      revenue: 1660250,
      expenses: 948000,
      profit: 712250,
      customers: 96,
      healthScore: 84,
    },
    delta: {
      revenueDiff: 210250,
      revenuePct: 14.5,
      expenseDiff: 58000,
      expensePct: 6.5,
      profitDiff: 152250,
      profitPct: 27.2,
      customerDiff: 12,
    },
    isSaved: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  };

  const scenarioB: ScenarioRecord = {
    id: 'scen_price_10',
    businessId,
    name: '10% Price Increase on Flagship ERP',
    description: 'Assess profitability elasticity assuming a modest 1.5% churn uptick against 10% unit price increase.',
    parameters: {
      priceChangePct: 10,
      marketingBudgetChangePct: 0,
      employeeChangeCount: 0,
      avgSalary: 115000,
      salesGrowthPct: 8.2,
      churnChangePct: 1.5,
      operatingExpenseChangePct: 0,
    },
    baseline: {
      revenue: 1450000,
      expenses: 890000,
      profit: 560000,
      customers: 84,
      healthScore: 78,
    },
    simulated: {
      revenue: 1568900,
      expenses: 890000,
      profit: 678900,
      customers: 83,
      healthScore: 81,
    },
    delta: {
      revenueDiff: 118900,
      revenuePct: 8.2,
      expenseDiff: 0,
      expensePct: 0,
      profitDiff: 118900,
      profitPct: 21.2,
      customerDiff: -1,
    },
    isSaved: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  };

  db.addScenario(scenarioA);
  db.addScenario(scenarioB);

  // Pre-configured Reports
  const report1: ReportRecord = {
    id: 'rep_q3_exec_summary',
    businessId,
    title: 'Q3 Executive Business & Performance Audit',
    type: 'Executive Summary',
    period: 'Q3 2026',
    summary: 'Strong financial quarter propelled by Enterprise subscription contracts and healthy gross margins of 77.2%. Net profitability reached ₹5.60L/month with a 14.5% sequential acceleration in new deal closures.',
    kpis: {
      revenue: 4150000,
      expenses: 2590000,
      netProfit: 1560000,
      profitMargin: 37.6,
      customerCount: 84,
      growthRate: 14.2,
    },
    insights: [
      'Enterprise tier ARR accounts for 68% of total recurring revenue with sub-3% annual churn.',
      'Customer Acquisition Cost (CAC) improved by 8.4% due to higher organic search conversions.',
      'Engineering and cloud hosting constitute 66% of total operating expense overhead.'
    ],
    recommendations: [
      'Expand B2B Sales headcount in Northern region where enterprise conversion rate is 32%.',
      'Bundle Apex AI Add-on into renewal contracts to maximize net revenue retention (NRR).',
      'Implement multi-cloud auto-scaling to shave ₹35,000 monthly off AWS hosting expenses.'
    ],
    keyObservations: [
      'Operating cash flow positive for 6 consecutive months.',
      'Customer lifetime value to acquisition cost ratio (LTV:CAC) healthy at 5.8x.'
    ],
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  };
  db.addReport(report1);

  // Notifications
  const notifs: NotificationRecord[] = [
    {
      id: 'notif_1',
      businessId,
      type: 'revenue_growth',
      title: 'Monthly Revenue High Achieved',
      message: 'September 2026 revenue crossed ₹14,50,000, up 14.2% compared to the prior quarter average.',
      severity: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'notif_2',
      businessId,
      type: 'expense_alert',
      title: 'Infrastructure Cost Increase',
      message: 'Cloud infrastructure expense rose by 8.4% this month due to data ingestion pipeline spikes.',
      severity: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'notif_3',
      businessId,
      type: 'churn_risk',
      title: 'Customer Churn Watch',
      message: 'Solaris Green Power has flagged High churn risk due to 45 days of reduced platform activity.',
      severity: 'critical',
      read: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'notif_4',
      businessId,
      type: 'ai_report_ready',
      title: 'AI Multi-Agent Synthesis Completed',
      message: 'Strategy and Finance agents completed the Q3 automated audit report with strategic action plans.',
      severity: 'info',
      read: true,
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
  ];
  notifs.forEach(n => db.addNotification(n));

  // Support Tickets
  const ticket1: SupportTicketRecord = {
    id: 'tkt_001',
    ticketNumber: 'BM-2026-000124',
    userId,
    businessId,
    name: 'Vikramaditya Sharma',
    email: 'gbd9109@gmail.com',
    category: 'AI Features',
    priority: 'High',
    subject: 'Request assistance integrating custom webhook for live ERP sync',
    message: 'Hello BizMind AI Support team, we are configuring the Data Import connector for our SAP/Tally instance and would like to understand if automated daily scheduled ingestion is supported.',
    status: 'In Progress',
    assignedTo: 'BizMind Support Admin',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  };

  const ticket2: SupportTicketRecord = {
    id: 'tkt_002',
    ticketNumber: 'BM-2026-000098',
    userId,
    businessId,
    name: 'Vikramaditya Sharma',
    email: 'gbd9109@gmail.com',
    category: 'Dashboard',
    priority: 'Medium',
    subject: 'Exporting scenario comparison tables to Excel spreadsheet format',
    message: 'Can we bulk export all 3 comparative what-if simulations directly into an executive board deck format?',
    status: 'Resolved',
    assignedTo: 'BizMind Support Admin',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  };

  db.addSupportTicket(ticket1);
  db.addSupportTicket(ticket2);

  const messages: SupportMessageRecord[] = [
    {
      id: 'msg_1',
      ticketId: 'tkt_001',
      senderRole: 'user',
      senderName: 'Vikramaditya Sharma',
      message: 'Hello BizMind AI Support team, we are configuring the Data Import connector for our SAP/Tally instance and would like to understand if automated daily scheduled ingestion is supported.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'msg_2',
      ticketId: 'tkt_001',
      senderRole: 'support',
      senderName: 'BizMind Specialist (Support Admin)',
      message: 'Hi Vikramaditya! Yes, you can use our REST Import API `/api/import/sales` and `/api/import/expenses` or upload CSV/Excel files directly. We also support automated sync scripts. Feel free to call us at +91 8988542477 or ping on WhatsApp (+91 7590081172) if you need a screenshare setup.',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'msg_3',
      ticketId: 'tkt_002',
      senderRole: 'user',
      senderName: 'Vikramaditya Sharma',
      message: 'Can we bulk export all 3 comparative what-if simulations directly into an executive board deck format?',
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 'msg_4',
      ticketId: 'tkt_002',
      senderRole: 'support',
      senderName: 'BizMind Specialist',
      message: 'Yes! The Scenario Comparison page allows CSV and PDF downloads with high-resolution visual charts. This issue is resolved now.',
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    }
  ];
  messages.forEach(m => db.addSupportMessage(m));

  db.saveSync();
  console.log('BizMind AI database seed completed successfully!');
}
