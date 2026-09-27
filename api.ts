const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('bizmind_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const data = await response.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // ignore
    }
    throw new ApiError(errorMsg, response.status);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (body: Record<string, unknown>) => request<{ message: string; token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: Record<string, unknown>) => request<{ message: string; token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  getMe: () => request<{ user: any }>('/auth/me'),
  forgotPassword: (email: string) => request<{ message: string; demoNotice?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  updateProfile: (data: Record<string, unknown>) => request<{ message: string; user: any }>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: Record<string, unknown>) => request<{ message: string }>('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAccount: () => request<{ message: string }>('/auth/account', { method: 'DELETE' }),

  // Dashboard
  getDashboard: () => request<any>('/dashboard'),
  askDashboardAI: (question: string) => request<{ question: string; answer: string; supportingMetrics: any }>('/dashboard/ask', { method: 'POST', body: JSON.stringify({ question }) }),

  // Business
  getBusiness: () => request<{ business: any }>('/business'),
  updateBusiness: (data: Record<string, unknown>) => request<{ message: string; business: any }>('/business', { method: 'PUT', body: JSON.stringify(data) }),
  resetDemoData: () => request<{ message: string }>('/business/reset-demo', { method: 'POST' }),
  clearData: () => request<{ message: string }>('/business/clear-data', { method: 'DELETE' }),

  // Analytics
  getSalesAnalytics: () => request<any>('/analytics/sales'),
  getFinanceAnalytics: () => request<any>('/analytics/finance'),
  getCustomerAnalytics: () => request<any>('/analytics/customers'),
  getEmployeeAnalytics: () => request<any>('/analytics/employees'),

  // AI Agents
  getAgents: () => request<{ agents: any[]; recentRuns: any[] }>('/agents'),
  runAgent: (body: { agentType?: string; question: string }) => request<{ run: any }>('/agents/run', { method: 'POST', body: JSON.stringify(body) }),

  // Copilot
  getCopilotMessages: () => request<{ messages: any[] }>('/copilot/messages'),
  sendCopilotMessage: (message: string) => request<{ message: any }>('/copilot/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  clearCopilot: () => request<{ message: string }>('/copilot/clear', { method: 'DELETE' }),

  // Digital Twin
  getDigitalTwin: () => request<any>('/digital-twin'),

  // Scenarios
  simulateScenario: (params: Record<string, unknown>) => request<{ simulation: any; disclaimer: string }>('/scenarios/simulate', { method: 'POST', body: JSON.stringify(params) }),
  getScenarios: () => request<{ scenarios: any[] }>('/scenarios'),
  saveScenario: (data: Record<string, unknown>) => request<{ message: string; scenario: any }>('/scenarios', { method: 'POST', body: JSON.stringify(data) }),
  duplicateScenario: (id: string) => request<{ message: string; scenario: any }>(`/scenarios/${id}/duplicate`, { method: 'POST' }),
  deleteScenario: (id: string) => request<{ message: string }>(`/scenarios/${id}`, { method: 'DELETE' }),

  // Reports
  getReports: () => request<{ reports: any[] }>('/reports'),
  getReportById: (id: string) => request<{ report: any }>(`/reports/${id}`),
  generateReport: (data: Record<string, unknown>) => request<{ message: string; report: any }>('/reports/generate', { method: 'POST', body: JSON.stringify(data) }),

  // Import
  validateImport: (rawText: string, category: string) => request<any>('/import/validate', { method: 'POST', body: JSON.stringify({ rawText, category }) }),
  confirmImport: (data: { category: string; rows: any[]; mapping?: any }) => request<any>('/import/confirm', { method: 'POST', body: JSON.stringify(data) }),
  loadSampleImport: (datasetType: string) => request<{ message: string; count: number }>('/import/sample', { method: 'POST', body: JSON.stringify({ datasetType }) }),

  // Notifications
  getNotifications: () => request<{ notifications: any[]; unreadCount: number }>('/notifications'),
  markNotificationRead: (id: string) => request<{ message: string }>(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request<{ message: string }>('/notifications/mark-all-read', { method: 'POST' }),
  deleteNotification: (id: string) => request<{ message: string }>(`/notifications/${id}`, { method: 'DELETE' }),

  // Support
  getSupportInfo: () => request<{ contact: any }>('/support/info'),
  getTickets: () => request<{ tickets: any[] }>('/support/tickets'),
  createTicket: (data: Record<string, unknown>) => request<{ message: string; ticket: any }>('/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
  getTicketDetails: (id: string) => request<{ ticket: any; messages: any[] }>(`/support/tickets/${id}`),
  postTicketMessage: (id: string, message: string, attachmentUrl?: string) => request<{ message: string; newMessage: any }>(`/support/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ message, attachmentUrl }) }),

  // Admin
  getAdminTickets: () => request<{ tickets: any[] }>('/support/admin/all-tickets'),
  updateAdminTicket: (id: string, data: Record<string, unknown>) => request<{ message: string; ticket: any }>(`/support/admin/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Search
  search: (query: string) => request<{ query: string; totalMatches: number; results: any }>(`/search?q=${encodeURIComponent(query)}`),
};
