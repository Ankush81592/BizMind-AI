import { Router, Response } from 'express';
import { db, SaleRecord, ExpenseRecord, CustomerRecord, EmployeeRecord, ProductRecord } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// Validate and parse raw tabular/CSV text
router.post('/validate', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { rawText, category } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      res.status(400).json({ error: 'Please provide CSV or structured table text to validate.' });
      return;
    }

    const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      res.status(400).json({ error: 'Data must contain at least a header row and one row of data.' });
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1, 11).map(line => {
      return line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
    });

    const totalRowsCount = lines.length - 1;

    // Detect suggested column mappings based on category
    const suggestedMapping: Record<string, string> = {};
    headers.forEach(h => {
      const hLower = h.toLowerCase();
      if (hLower.includes('date') || hLower.includes('time')) suggestedMapping[h] = 'date';
      else if (hLower.includes('amount') || hLower.includes('price') || hLower.includes('revenue') || hLower.includes('cost')) suggestedMapping[h] = 'amount';
      else if (hLower.includes('product') || hLower.includes('item') || hLower.includes('sku')) suggestedMapping[h] = 'product';
      else if (hLower.includes('customer') || hLower.includes('client') || hLower.includes('buyer')) suggestedMapping[h] = 'customerName';
      else if (hLower.includes('category') || hLower.includes('dept') || hLower.includes('department')) suggestedMapping[h] = 'category';
      else if (hLower.includes('name')) suggestedMapping[h] = 'name';
      else if (hLower.includes('email')) suggestedMapping[h] = 'email';
      else if (hLower.includes('salary')) suggestedMapping[h] = 'salary';
      else suggestedMapping[h] = 'ignore';
    });

    res.json({
      valid: true,
      category: category || 'Sales',
      headers,
      suggestedMapping,
      previewRows: rows,
      totalRows: totalRowsCount,
    });
  } catch (err: unknown) {
    console.error('Validate import error:', err);
    res.status(500).json({ error: 'Failed to parse tabular file format.' });
  }
});

// Confirm and commit import
router.post('/confirm', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { category, rows, mapping } = req.body;
    const businessId = req.user!.businessId;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: 'No data rows provided for import.' });
      return;
    }

    let importedCount = 0;

    if (category === 'Sales') {
      const salesBatch: SaleRecord[] = rows.map((r: Record<string, unknown>, idx: number) => ({
        id: `sale_imp_${Date.now()}_${idx}`,
        businessId,
        date: String(r.date || new Date().toISOString().split('T')[0]),
        month: String(r.month || 'Current Month'),
        amount: Number(r.amount || r.price || 15000),
        units: Number(r.units || 1),
        product: String(r.product || 'Standard Product Package'),
        channel: String(r.channel || 'Direct Sales'),
        customerName: String(r.customerName || 'Direct Client'),
        region: String(r.region || 'India - Central'),
        status: 'Completed',
      }));
      db.addSalesBatch(salesBatch);
      importedCount = salesBatch.length;
    } else if (category === 'Expenses') {
      const expensesBatch: ExpenseRecord[] = rows.map((r: Record<string, unknown>, idx: number) => ({
        id: `exp_imp_${Date.now()}_${idx}`,
        businessId,
        date: String(r.date || new Date().toISOString().split('T')[0]),
        month: String(r.month || 'Current Month'),
        amount: Number(r.amount || 5000),
        category: String(r.category || 'Operations'),
        department: String(r.department || 'Operations'),
        description: String(r.description || 'Imported expense entry'),
        recurring: Boolean(r.recurring),
      }));
      db.addExpensesBatch(expensesBatch);
      importedCount = expensesBatch.length;
    } else if (category === 'Customers') {
      const customersBatch: CustomerRecord[] = rows.map((r: Record<string, unknown>, idx: number) => ({
        id: `cust_imp_${Date.now()}_${idx}`,
        businessId,
        name: String(r.name || 'New Client'),
        email: String(r.email || `client${idx}@example.com`),
        phone: String(r.phone || '+91 9800000000'),
        company: String(r.company || 'Enterprise Partner'),
        segment: (r.segment as 'Enterprise' | 'Mid-Market' | 'SMB') || 'Mid-Market',
        ltv: Number(r.ltv || 150000),
        cac: Number(r.cac || 25000),
        churnRisk: (r.churnRisk as 'Low' | 'Medium' | 'High') || 'Low',
        status: 'Active',
        joinedDate: String(r.joinedDate || new Date().toISOString().split('T')[0]),
        totalOrders: Number(r.totalOrders || 1),
      }));
      db.addCustomersBatch(customersBatch);
      importedCount = customersBatch.length;
    } else {
      res.status(400).json({ error: `Unsupported import category: ${category}` });
      return;
    }

    // Add alert notification
    db.addNotification({
      id: `notif_imp_${Date.now()}`,
      businessId,
      type: 'import_success',
      title: `${importedCount} ${category} Records Imported`,
      message: `Successfully validated and merged ${importedCount} records into your business command center.`,
      severity: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: `Successfully imported ${importedCount} ${category} records.`,
      importedCount,
    });
  } catch (err: unknown) {
    console.error('Confirm import error:', err);
    res.status(500).json({ error: 'Failed to process import dataset.' });
  }
});

// Load sample dataset directly
router.post('/sample', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { datasetType } = req.body;
    const businessId = req.user!.businessId;

    if (datasetType === 'retail') {
      const retailSales: SaleRecord[] = [
        { id: `sale_ret_1`, businessId, date: '2026-09-01', month: 'Sep 2026', amount: 85000, units: 42, product: 'Smart POS Terminal V2', channel: 'Inbound Web', customerName: 'Metro Hypermarket', region: 'North', status: 'Completed' },
        { id: `sale_ret_2`, businessId, date: '2026-09-05', month: 'Sep 2026', amount: 140000, units: 10, product: 'Omnichannel Inventory Hub', channel: 'Enterprise Direct', customerName: 'Lifestyle Retailers', region: 'West', status: 'Completed' },
        { id: `sale_ret_3`, businessId, date: '2026-09-12', month: 'Sep 2026', amount: 55000, units: 25, product: 'Barcode Thermal Scanners', channel: 'Partner Referral', customerName: 'Speedy Express Depot', region: 'South', status: 'Completed' },
      ];
      db.addSalesBatch(retailSales);
      res.json({ message: 'Retail sample dataset loaded successfully.', count: retailSales.length });
    } else {
      // Default SaaS Expansion pack
      const saasSales: SaleRecord[] = [
        { id: `sale_saas_1`, businessId, date: '2026-09-20', month: 'Sep 2026', amount: 240000, units: 4, product: 'Apex ERP Cloud Pro', channel: 'Enterprise Direct', customerName: 'Bajaj Capital Infotech', region: 'West', status: 'Completed' },
        { id: `sale_saas_2`, businessId, date: '2026-09-22', month: 'Sep 2026', amount: 112000, units: 4, product: 'Apex Workflow Automation Suite', channel: 'Inbound Web', customerName: 'Hindustan Logistics', region: 'North', status: 'Completed' },
      ];
      db.addSalesBatch(saasSales);
      res.json({ message: 'Enterprise SaaS expansion dataset merged.', count: saasSales.length });
    }
  } catch (err: unknown) {
    console.error('Sample import error:', err);
    res.status(500).json({ error: 'Failed to load sample dataset.' });
  }
});

export default router;
