export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  businessId: string;
  businessName?: string;
  businessType?: string;
  currency?: string;
  phone?: string;
  createdAt?: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  currency: string;
  industry: string;
  targetRevenue: number;
  healthScore: number;
  healthBreakdown: {
    financial: number;
    sales: number;
    customer: number;
    operational: number;
    marketing: number;
    workforce: number;
  };
}

export interface DashboardData {
  business: {
    id: string;
    name: string;
    type: string;
    currency: string;
    healthScore: number;
  };
  kpis: {
    revenue: number;
    expenses: number;
    netProfit: number;
    profitMargin: number;
    customers: number;
    orders: number;
    employees: number;
    growthRate: number;
    expenseGrowth: number;
  };
  charts: {
    revenueVsExpenses: Array<{ month: string; revenue: number; expenses: number; profit: number; marginPct: number }>;
    monthlySales: Array<{ month: string; sales: number; units: number }>;
    customerGrowth: Array<{ month: string; count: number }>;
    profitTrend: Array<{ month: string; profit: number }>;
    productPerformance: Array<{ name: string; category: string; revenue: number; units: number; marginPct: number }>;
  };
  aiInsight: {
    headline: string;
    detail: string;
    keyTakeaways: string[];
    healthScore: number;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  capabilities: string[];
  status: string;
}

export interface AgentRun {
  id: string;
  agentType: string;
  question: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  timeline: Array<{
    step: string;
    agent: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
    timestamp: string;
    details?: string;
  }>;
  result?: {
    summary: string;
    findings: string[];
    actionItems: string[];
    confidence: number;
  };
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metrics?: Record<string, unknown>;
  charts?: {
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: Array<{ label: string; value: number }>;
  };
  actions?: string[];
  timestamp: string;
}

export interface DigitalTwinData {
  business: {
    id: string;
    name: string;
    type: string;
    currency: string;
  };
  health: {
    score: number;
    breakdown: {
      financial: number;
      sales: number;
      customer: number;
      operational: number;
      marketing: number;
      workforce: number;
    };
    factors: Array<{
      dimension: string;
      score: number;
      weight: string;
      detail: string;
    }>;
  };
  virtualModel: {
    revenueStreams: Array<{ name: string; share: number; monthlyValue: number }>;
    salesChannels: Array<{ channel: string; conversionRate: string; leadTimeDays: number }>;
    costStructures: Array<{ category: string; amount: number; pct: number }>;
    inventoryAndCapacity: {
      totalProducts: number;
      softwareLicensesAvailable: string;
      teamCapacityUtilization: string;
      supportTicketTurnaroundHours: number;
    };
    funnelMetrics: {
      monthlyWebsiteVisitors: number;
      monthlyLeadsGenerated: number;
      qualifiedSalesOpportunities: number;
      newClosedDeals: number;
      visitorToCustomerPct: number;
    };
  };
}

export interface Scenario {
  id: string;
  businessId: string;
  name: string;
  description: string;
  parameters: {
    priceChangePct: number;
    marketingBudgetChangePct: number;
    employeeChangeCount: number;
    avgSalary: number;
    salesGrowthPct: number;
    churnChangePct: number;
    operatingExpenseChangePct: number;
  };
  baseline: {
    revenue: number;
    expenses: number;
    profit: number;
    customers: number;
    healthScore: number;
  };
  simulated: {
    revenue: number;
    expenses: number;
    profit: number;
    customers: number;
    healthScore: number;
  };
  delta: {
    revenueDiff: number;
    revenuePct: number;
    expenseDiff: number;
    expensePct: number;
    profitDiff: number;
    profitPct: number;
    customerDiff: number;
  };
  isSaved?: boolean;
  createdAt: string;
}

export interface BusinessReport {
  id: string;
  businessId: string;
  title: string;
  type: string;
  period: string;
  summary: string;
  kpis: {
    revenue: number;
    expenses: number;
    netProfit: number;
    profitMargin: number;
    customerCount: number;
    growthRate: number;
  };
  insights: string[];
  recommendations: string[];
  keyObservations: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  businessId: string;
  name: string;
  email: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderRole: 'user' | 'support' | 'admin';
  senderName: string;
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}
