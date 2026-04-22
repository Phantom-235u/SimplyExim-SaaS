const express = require('express');
const Audit = require('../models/Audit');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/audits — Create new audit
router.post('/', auth, async (req, res) => {
  try {
    // Check plan limits
    const user = await User.findById(req.userId);
    if (!user.canCreateAudit()) {
      return res.status(403).json({
        message: 'Free plan limit reached (5 audits/month). Upgrade to Pro for unlimited audits.',
        limitReached: true
      });
    }

    const audit = new Audit({ ...req.body, userId: req.userId });
    const savedAudit = await audit.save();

    // Increment audit counter
    user.auditsThisMonth += 1;
    await user.save();

    res.status(201).json(savedAudit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/audits — Get all audits for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const audits = await Audit.find({ userId: req.userId }).sort({ created: -1 });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/audits/compliance — Get active audits within risk window
router.get('/compliance', auth, async (req, res) => {
  try {
    const audits = await Audit.find({
      userId: req.userId,
      bankClosed: false,
      status: { $ne: 'Completed' }
    }).sort({ deadline: 1 });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/audits/:id — Update audit (bank closure, status, etc.)
router.patch('/:id', auth, async (req, res) => {
  try {
    const audit = await Audit.findOne({ _id: req.params.id, userId: req.userId });
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found.' });
    }

    const { bankClosed, status, buyerName, amount } = req.body;

    if (bankClosed !== undefined) {
      audit.bankClosed = bankClosed;
      if (bankClosed) {
        audit.bankClosedDate = new Date();
        audit.status = 'Completed';
      } else {
        audit.bankClosedDate = undefined;
        audit.status = 'Active';
      }
    }
    if (status) audit.status = status;
    if (buyerName) audit.buyerName = buyerName;
    if (amount !== undefined) audit.amount = amount;

    const updatedAudit = await audit.save();
    res.json(updatedAudit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/audits/:id — Delete an audit
router.delete('/:id', auth, async (req, res) => {
  try {
    const audit = await Audit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found.' });
    }
    res.json({ message: 'Audit deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
