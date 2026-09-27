import { Router, Response } from 'express';
import { db } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';
import { seedDemoData } from '../seed.js';

const router = Router();

// Get Business info
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const business = db.getBusiness(businessId);
  if (!business) {
    res.status(404).json({ error: 'Business entity not found.' });
    return;
  }
  res.json({ business });
});

// Update Business info
router.put('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId;
    const { name, type, industry, currency, targetRevenue } = req.body;

    const updated = db.updateBusiness(businessId, {
      ...(name ? { name } : {}),
      ...(type ? { type } : {}),
      ...(industry ? { industry } : {}),
      ...(currency ? { currency } : {}),
      ...(targetRevenue !== undefined ? { targetRevenue: Number(targetRevenue) } : {}),
    });

    res.json({ message: 'Business configuration updated.', business: updated });
  } catch (err: unknown) {
    console.error('Update business error:', err);
    res.status(500).json({ error: 'Failed to update business settings.' });
  }
});

// Reset Demo Data
router.post('/reset-demo', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId;
    // Clear current data and reseed
    db.deleteBusinessData(businessId);
    // Reset seed
    await seedDemoData();
    res.json({ message: 'Demo business data successfully restored.' });
  } catch (err: unknown) {
    console.error('Reset demo error:', err);
    res.status(500).json({ error: 'Failed to reset demo dataset.' });
  }
});

// Clear all business data
router.delete('/clear-data', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const businessId = req.user!.businessId;
    db.deleteBusinessData(businessId);
    res.json({ message: 'All transactions, customers, and analytics records cleared.' });
  } catch (err: unknown) {
    console.error('Clear data error:', err);
    res.status(500).json({ error: 'Failed to clear business data.' });
  }
});

export default router;
