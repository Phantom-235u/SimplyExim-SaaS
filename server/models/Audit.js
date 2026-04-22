const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true },
  buyerName: { type: String, required: true, trim: true },
  invoiceDate: { type: Date, required: true },
  currency: { type: String, required: true },
  amount: { type: Number, default: 0 },
  deadline: { type: String, required: true },
  status: { type: String, default: 'Active', enum: ['Active', 'Completed', 'Overdue'] },
  bankClosed: { type: Boolean, default: false },
  bankClosedDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audit', AuditSchema);
