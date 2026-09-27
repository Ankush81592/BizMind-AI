import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, User, Business } from '../db.js';
import { generateToken, authMiddleware, AuthRequest } from '../auth.js';

const router = Router();

// Register
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, businessName, businessType, phone } = req.body;

    if (!name || !email || !password || !businessName) {
      res.status(400).json({ error: 'Name, email, password, and business name are required.' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const businessId = `biz_${Date.now()}`;
    const userId = `usr_${Date.now()}`;
    const passwordHash = await bcrypt.hash(password, 10);

    const business: Business = {
      id: businessId,
      name: businessName,
      type: businessType || 'General Business',
      currency: 'INR',
      industry: businessType || 'General Business',
      targetRevenue: 10000000,
      healthScore: 75,
      healthBreakdown: {
        financial: 75,
        sales: 75,
        customer: 75,
        operational: 75,
        marketing: 75,
        workforce: 75,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.addBusiness(business);

    const user: User = {
      id: userId,
      email,
      passwordHash,
      name,
      role: 'user',
      businessId,
      phone: phone || '',
      createdAt: new Date().toISOString(),
    };
    db.addUser(user);

    const token = generateToken(user);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 86400000,
    });

    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
        businessName: business.name,
      },
    });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const business = db.getBusiness(user.businessId);
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: (rememberMe ? 30 : 7) * 86400000,
    });

    res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
        businessName: business ? business.name : 'My Business',
        phone: user.phone,
      },
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal login error.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

// Get Current User (Me)
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const business = db.getBusiness(req.user.businessId);
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      businessId: req.user.businessId,
      businessName: business ? business.name : 'My Business',
      businessType: business ? business.type : '',
      currency: business ? business.currency : 'INR',
      phone: req.user.phone,
      createdAt: req.user.createdAt,
    },
  });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    // Return friendly generic response for security
    res.json({ message: 'If this email exists in our records, password reset instructions have been dispatched.' });
    return;
  }
  // For demo/production reset simulation
  res.json({
    message: `Password reset link dispatched to ${email}. Check your inbox or use our support phone (+91 8988542477) for instant assistance.`,
    demoNotice: 'For testing, you may log in with demo credentials demo@bizmind.ai / Password123!',
  });
});

// Update Profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, businessName, businessType, currency } = req.body;
    const user = req.user!;

    if (name || phone !== undefined) {
      db.updateUser(user.id, {
        ...(name ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      });
    }

    if (businessName || businessType || currency) {
      db.updateBusiness(user.businessId, {
        ...(businessName ? { name: businessName } : {}),
        ...(businessType ? { type: businessType } : {}),
        ...(currency ? { currency } : {}),
      });
    }

    const updatedUser = db.findUserById(user.id);
    const updatedBiz = db.getBusiness(user.businessId);

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        name: updatedUser!.name,
        role: updatedUser!.role,
        businessId: updatedUser!.businessId,
        businessName: updatedBiz?.name,
        businessType: updatedBiz?.type,
        currency: updatedBiz?.currency,
        phone: updatedUser!.phone,
      },
    });
  } catch (err: unknown) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Change Password
router.put('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user!;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      res.status(400).json({ error: 'Current password does not match.' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    db.updateUser(user.id, { passwordHash });

    res.json({ message: 'Password changed successfully.' });
  } catch (err: unknown) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// Delete Account
router.delete('/account', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    db.deleteBusinessData(user.businessId);
    db.deleteUser(user.id);
    res.clearCookie('token');
    res.json({ message: 'Account and associated business data deleted permanently.' });
  } catch (err: unknown) {
    console.error('Account delete error:', err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

export default router;
