const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  company: { type: String, trim: true },

  // Subscription
  plan: { type: String, default: 'free', enum: ['free', 'payperaudit', 'monthly', 'enterprise'] },
  planExpiresAt: { type: Date },
  auditCredits: { type: Number, default: 0 }, // Pay-per-audit credits
  activeShipmentLimit: { type: Number, default: 2 }, // Free = 2, monthly = 20, enterprise = unlimited
  razorpayCustomerId: { type: String },
  razorpaySubscriptionId: { type: String },

  // CA (Chartered Accountant) linked account — Enterprise only
  isCA: { type: Boolean, default: false },
  linkedExporters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Auth
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if user can create an audit
UserSchema.methods.canCreateAudit = function () {
  if (this.plan === 'enterprise') return true;
  if (this.plan === 'monthly') return true; // checked against active shipment limit elsewhere
  if (this.plan === 'payperaudit') return this.auditCredits > 0;
  // Free: allow 2 audits to try the platform
  return true;
};

module.exports = mongoose.model('User', UserSchema);
