import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  businessId: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface SaleRecord {
  id: string;
  businessId: string;
  date: string;
  month: string;
  amount: number;
  units: number;
  product: string;
  channel: string;
  customerName: string;
  region: string;
  status: 'Completed' | 'Pending' | 'Refunded';
}

export interface ExpenseRecord {
  id: string;
  businessId: string;
  date: string;
  month: string;
  amount: number;
  category: string;
  department: string;
  description: string;
  recurring: boolean;
}

export interface CustomerRecord {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: 'Enterprise' | 'Mid-Market' | 'SMB';
  ltv: number;
  cac: number;
  churnRisk: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Churned' | 'At Risk';
  joinedDate: string;
  totalOrders: number;
}

export interface EmployeeRecord {
  id: string;
  businessId: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  performanceScore: number; // 1 to 10
  hireDate: string;
  status: 'Active' | 'On Leave';
}

export interface ProductRecord {
  id: string;
  businessId: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  unitsSold: number;
  marginPct: number;
}

export interface MarketingCampaign {
  id: string;
  businessId: string;
  name: string;
  channel: string;
  spend: number;
  leads: number;
  conversions: number;
  roi: number;
  status: 'Active' | 'Completed' | 'Paused';
}

export interface ScenarioRecord {
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
  isSaved: boolean;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  businessId: string;
  title: string;
  type: 'Daily Summary' | 'Weekly Business Report' | 'Monthly Business Report' | 'Financial Report' | 'Sales Report' | 'Customer Report' | 'Executive Summary';
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

export interface NotificationRecord {
  id: string;
  businessId: string;
  type: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  read: boolean;
  createdAt: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  userId: string;
  businessId: string;
  name: string;
  email: string;
  category: 'Account' | 'Billing' | 'AI Features' | 'Data Import' | 'Dashboard' | 'Technical Issue' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessageRecord {
  id: string;
  ticketId: string;
  senderRole: 'user' | 'support' | 'admin';
  senderName: string;
  message: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface ChatMessageRecord {
  id: string;
  businessId: string;
  userId: string;
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

export interface AgentRunRecord {
  id: string;
  businessId: string;
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

export interface DatabaseSchema {
  users: User[];
  businesses: Business[];
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  customers: CustomerRecord[];
  employees: EmployeeRecord[];
  products: ProductRecord[];
  campaigns: MarketingCampaign[];
  scenarios: ScenarioRecord[];
  reports: ReportRecord[];
  notifications: NotificationRecord[];
  supportTickets: SupportTicketRecord[];
  supportMessages: SupportMessageRecord[];
  chatMessages: ChatMessageRecord[];
  agentRuns: AgentRunRecord[];
}

const DB_FILE = path.resolve(process.cwd(), 'data', 'bizmind-db.json');

class DatabaseStore {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load DB file, initializing clean database:', e);
    }

    return {
      users: [],
      businesses: [],
      sales: [],
      expenses: [],
      customers: [],
      employees: [],
      products: [],
      campaigns: [],
      scenarios: [],
      reports: [],
      notifications: [],
      supportTickets: [],
      supportMessages: [],
      chatMessages: [],
      agentRuns: [],
    };
  }

  public saveSync(): void {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist DB file:', e);
    }
  }

  public save(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveSync();
    }, 100);
  }

  public getRaw(): DatabaseSchema {
    return this.data;
  }

  // --- Users ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public addUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Business ---
  public getBusiness(id: string): Business | undefined {
    return this.data.businesses.find(b => b.id === id);
  }

  public addBusiness(biz: Business): Business {
    this.data.businesses.push(biz);
    this.save();
    return biz;
  }

  public updateBusiness(id: string, updates: Partial<Business>): Business | undefined {
    const idx = this.data.businesses.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    this.data.businesses[idx] = { ...this.data.businesses[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.businesses[idx];
  }

  // --- Sales ---
  public getSales(businessId: string): SaleRecord[] {
    return this.data.sales.filter(s => s.businessId === businessId);
  }

  public addSale(sale: SaleRecord): SaleRecord {
    this.data.sales.push(sale);
    this.save();
    return sale;
  }

  public addSalesBatch(sales: SaleRecord[]): void {
    this.data.sales.push(...sales);
    this.save();
  }

  // --- Expenses ---
  public getExpenses(businessId: string): ExpenseRecord[] {
    return this.data.expenses.filter(e => e.businessId === businessId);
  }

  public addExpense(expense: ExpenseRecord): ExpenseRecord {
    this.data.expenses.push(expense);
    this.save();
    return expense;
  }

  public addExpensesBatch(expenses: ExpenseRecord[]): void {
    this.data.expenses.push(...expenses);
    this.save();
  }

  // --- Customers ---
  public getCustomers(businessId: string): CustomerRecord[] {
    return this.data.customers.filter(c => c.businessId === businessId);
  }

  public addCustomer(customer: CustomerRecord): CustomerRecord {
    this.data.customers.push(customer);
    this.save();
    return customer;
  }

  public addCustomersBatch(customers: CustomerRecord[]): void {
    this.data.customers.push(...customers);
    this.save();
  }

  // --- Employees ---
  public getEmployees(businessId: string): EmployeeRecord[] {
    return this.data.employees.filter(e => e.businessId === businessId);
  }

  public addEmployee(emp: EmployeeRecord): EmployeeRecord {
    this.data.employees.push(emp);
    this.save();
    return emp;
  }

  // --- Products ---
  public getProducts(businessId: string): ProductRecord[] {
    return this.data.products.filter(p => p.businessId === businessId);
  }

  public addProduct(product: ProductRecord): ProductRecord {
    this.data.products.push(product);
    this.save();
    return product;
  }

  // --- Campaigns ---
  public getCampaigns(businessId: string): MarketingCampaign[] {
    return this.data.campaigns.filter(c => c.businessId === businessId);
  }

  // --- Scenarios ---
  public getScenarios(businessId: string): ScenarioRecord[] {
    return this.data.scenarios.filter(s => s.businessId === businessId);
  }

  public addScenario(scenario: ScenarioRecord): ScenarioRecord {
    this.data.scenarios.push(scenario);
    this.save();
    return scenario;
  }

  public deleteScenario(id: string, businessId: string): boolean {
    const idx = this.data.scenarios.findIndex(s => s.id === id && s.businessId === businessId);
    if (idx === -1) return false;
    this.data.scenarios.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Reports ---
  public getReports(businessId: string): ReportRecord[] {
    return this.data.reports.filter(r => r.businessId === businessId);
  }

  public addReport(report: ReportRecord): ReportRecord {
    this.data.reports.push(report);
    this.save();
    return report;
  }

  // --- Notifications ---
  public getNotifications(businessId: string): NotificationRecord[] {
    return this.data.notifications
      .filter(n => n.businessId === businessId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationRead(id: string, businessId: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id && n.businessId === businessId);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(businessId: string): void {
    this.data.notifications.forEach(n => {
      if (n.businessId === businessId) n.read = true;
    });
    this.save();
  }

  public deleteNotification(id: string, businessId: string): boolean {
    const idx = this.data.notifications.findIndex(n => n.id === id && n.businessId === businessId);
    if (idx !== -1) {
      this.data.notifications.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  public addNotification(notif: NotificationRecord): void {
    this.data.notifications.unshift(notif);
    this.save();
  }

  // --- Support Tickets ---
  public getAllSupportTickets(): SupportTicketRecord[] {
    return [...this.data.supportTickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getSupportTickets(businessId: string): SupportTicketRecord[] {
    return this.data.supportTickets
      .filter(t => t.businessId === businessId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getTicketById(id: string): SupportTicketRecord | undefined {
    return this.data.supportTickets.find(t => t.id === id || t.ticketNumber === id);
  }

  public addSupportTicket(ticket: SupportTicketRecord): SupportTicketRecord {
    this.data.supportTickets.unshift(ticket);
    this.save();
    return ticket;
  }

  public updateSupportTicket(id: string, updates: Partial<SupportTicketRecord>): SupportTicketRecord | undefined {
    const idx = this.data.supportTickets.findIndex(t => t.id === id || t.ticketNumber === id);
    if (idx === -1) return undefined;
    this.data.supportTickets[idx] = { ...this.data.supportTickets[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.supportTickets[idx];
  }

  // --- Support Messages ---
  public getSupportMessages(ticketId: string): SupportMessageRecord[] {
    return this.data.supportMessages
      .filter(m => m.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public addSupportMessage(msg: SupportMessageRecord): SupportMessageRecord {
    this.data.supportMessages.push(msg);
    // Update ticket updatedAt
    this.updateSupportTicket(msg.ticketId, { updatedAt: msg.createdAt });
    this.save();
    return msg;
  }

  // --- Chat Messages ---
  public getChatMessages(businessId: string): ChatMessageRecord[] {
    return this.data.chatMessages
      .filter(c => c.businessId === businessId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public addChatMessage(msg: ChatMessageRecord): ChatMessageRecord {
    this.data.chatMessages.push(msg);
    this.save();
    return msg;
  }

  public clearChatMessages(businessId: string): void {
    this.data.chatMessages = this.data.chatMessages.filter(c => c.businessId !== businessId);
    this.save();
  }

  // --- Agent Runs ---
  public getAgentRuns(businessId: string): AgentRunRecord[] {
    return this.data.agentRuns
      .filter(r => r.businessId === businessId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addAgentRun(run: AgentRunRecord): AgentRunRecord {
    this.data.agentRuns.unshift(run);
    this.save();
    return run;
  }

  public updateAgentRun(id: string, updates: Partial<AgentRunRecord>): AgentRunRecord | undefined {
    const idx = this.data.agentRuns.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    this.data.agentRuns[idx] = { ...this.data.agentRuns[idx], ...updates };
    this.save();
    return this.data.agentRuns[idx];
  }

  // Reset or delete demo data for a business
  public deleteBusinessData(businessId: string): void {
    this.data.sales = this.data.sales.filter(s => s.businessId !== businessId);
    this.data.expenses = this.data.expenses.filter(e => e.businessId !== businessId);
    this.data.customers = this.data.customers.filter(c => c.businessId !== businessId);
    this.data.employees = this.data.employees.filter(e => e.businessId !== businessId);
    this.data.products = this.data.products.filter(p => p.businessId !== businessId);
    this.data.campaigns = this.data.campaigns.filter(c => c.businessId !== businessId);
    this.data.scenarios = this.data.scenarios.filter(s => s.businessId !== businessId);
    this.data.reports = this.data.reports.filter(r => r.businessId !== businessId);
    this.data.notifications = this.data.notifications.filter(n => n.businessId !== businessId);
    this.data.chatMessages = this.data.chatMessages.filter(c => c.businessId !== businessId);
    this.data.agentRuns = this.data.agentRuns.filter(a => a.businessId !== businessId);
    this.save();
  }
}

export const db = new DatabaseStore();
