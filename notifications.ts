import { Router, Response } from 'express';
import { db } from '../db.js';
import { authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// Get notifications
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const notifications = db.getNotifications(businessId);
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({ notifications, unreadCount });
});

// Mark single notification read
router.put('/:id/read', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const success = db.markNotificationRead(req.params.id, businessId);
  if (!success) {
    res.status(404).json({ error: 'Notification not found.' });
    return;
  }
  res.json({ message: 'Notification marked as read.' });
});

// Mark all read
router.post('/mark-all-read', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  db.markAllNotificationsRead(businessId);
  res.json({ message: 'All notifications marked as read.' });
});

// Delete notification
router.delete('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const businessId = req.user!.businessId;
  const success = db.deleteNotification(req.params.id, businessId);
  if (!success) {
    res.status(404).json({ error: 'Notification not found.' });
    return;
  }
  res.json({ message: 'Notification deleted.' });
});

export default router;
