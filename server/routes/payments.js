const express = require('express');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const PLANS = {
  payperaudit: {
    name: 'Pay-Per-Audit',
    amount: 5000, // ₹50 in paise
    currency: 'INR',
    description: '1 Audit Credit — ₹50 per PDF generated'
  },
  payperaudit5: {
    name: 'Pay-Per-Audit (5 Pack)',
    amount: 22500, // ₹225 (₹45 each — 10% discount)
    currency: 'INR',
    description: '5 Audit Credits — ₹45 each'
  },
  monthly: {
    name: 'Monthly Guard',
    amount: 49900, // ₹499
    currency: 'INR',
    description: '₹499/month — 20 active shipments + WhatsApp Alerts'
  },
  enterprise: {
    name: 'Enterprise',
    amount: 500000, // ₹5,000
    currency: 'INR',
    description: '₹5,000/month — Unlimited + CA login + Bulk uploads'
  }
};

// GET /api/payments/plans — Public pricing info
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

// POST /api/payments/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) {
      return res.status(400).json({ message: 'Invalid plan selected.' });
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: PLANS[plan].amount,
      currency: PLANS[plan].currency,
      receipt: `se_${plan}_${req.userId}_${Date.now()}`,
      notes: { userId: req.userId, plan }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      planName: PLANS[plan].name,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ message: 'Could not create payment order. Please try again.' });
  }
});

// POST /api/payments/verify — Verify payment & activate
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    if (plan === 'payperaudit') {
      user.auditCredits = (user.auditCredits || 0) + 1;
      if (user.plan === 'free') user.plan = 'payperaudit';
    } else if (plan === 'payperaudit5') {
      user.auditCredits = (user.auditCredits || 0) + 5;
      if (user.plan === 'free') user.plan = 'payperaudit';
    } else if (plan === 'monthly') {
      user.plan = 'monthly';
      user.planExpiresAt = expiresAt;
      user.activeShipmentLimit = 20;
    } else if (plan === 'enterprise') {
      user.plan = 'enterprise';
      user.planExpiresAt = expiresAt;
      user.activeShipmentLimit = 99999;
    }

    user.razorpaySubscriptionId = razorpay_payment_id;
    await user.save();

    res.json({
      message: `${PLANS[plan].name} activated successfully!`,
      user: {
        id: user._id, name: user.name, email: user.email, company: user.company,
        plan: user.plan, planExpiresAt: user.planExpiresAt,
        auditCredits: user.auditCredits, activeShipmentLimit: user.activeShipmentLimit
      }
    });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ message: 'Payment verification failed.' });
  }
});

// GET /api/payments/status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('plan planExpiresAt auditCredits activeShipmentLimit');

    // Auto-downgrade expired plans
    if (user.plan !== 'free' && user.plan !== 'payperaudit' && user.planExpiresAt && new Date() > user.planExpiresAt) {
      user.plan = 'free';
      user.planExpiresAt = undefined;
      user.activeShipmentLimit = 2;
      await user.save();
    }

    res.json({
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      auditCredits: user.auditCredits,
      activeShipmentLimit: user.activeShipmentLimit
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
