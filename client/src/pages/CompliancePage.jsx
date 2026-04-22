import React, { useState, useEffect } from 'react';
import { fetchComplianceAudits, updateAudit } from '../utils/api';

const REGULATIONS = [
  {
    date: 'April 2026',
    title: 'RBI/2026-27/01 — Updated EDPMS Monitoring Framework',
    body: 'RBI mandates tighter monitoring of export proceeds realization. Auto caution-listing now triggers at 15 months for FC and 18 months for INR settlements.'
  },
  {
    date: 'March 2026',
    title: 'FEMA Notification No. 432 — Revised Timelines',
    body: 'Export realization deadlines remain unchanged: 15 months (FC) and 18 months (INR). Non-compliance leads to EDPMS caution listing.'
  },
  {
    date: 'February 2026',
    title: 'DGFT Trade Notice 2026/04 — E-BRC Updates',
    body: 'Banks must now issue electronic bank realization certificates within 15 days of receipt. Exporters should ensure timely follow-up.'
  },
  {
    date: 'January 2026',
    title: 'RBI Master Direction — Export of Goods & Services',
    body: 'Comprehensive guidelines for exporters including realization timelines, documentation requirements, and penalty frameworks under FEMA 2026.'
  }
];

const CompliancePage = () => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertSettings, setAlertSettings] = useState(() => {
    const saved = localStorage.getItem('alertSettings');
    return saved ? JSON.parse(saved) : {
      phone: '',
      email: '',
      alert30: true,
      alert60: true,
      alert90: true
    };
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const data = await fetchComplianceAudits();
      setAudits(data);
    } catch (err) {
      console.error('Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  };

  const getRiskLevel = (daysLeft) => {
    if (daysLeft < 0) return 'overdue';
    if (daysLeft <= 30) return 'danger';
    if (daysLeft <= 90) return 'warning';
    return 'safe';
  };

  const getProgressPercent = (daysLeft, currency) => {
    const totalMonths = currency === 'INR' ? 18 : 15;
    const totalDays = totalMonths * 30;
    const elapsed = totalDays - daysLeft;
    return Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
  };

  const handleBankClosure = async (auditId, checked) => {
    try {
      await updateAudit(auditId, { bankClosed: checked });
      loadComplianceData();
    } catch (err) {
      alert('Failed to update. Please try again.');
    }
  };

  const saveAlertSettings = () => {
    localStorage.setItem('alertSettings', JSON.stringify(alertSettings));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const sortedAudits = [...audits].sort((a, b) => getDaysLeft(a.deadline) - getDaysLeft(b.deadline));
  const redZone = sortedAudits.filter(a => getDaysLeft(a.deadline) <= 90);
  const safeZone = sortedAudits.filter(a => getDaysLeft(a.deadline) > 90);

  if (loading) {
    return (
      <div className="page">
        <div className="loading-overlay">
          <div className="spinner" style={{ width: 40, height: 40 }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ Compliance Monitor</h1>
          <p className="page-subtitle">Live risk tracking for all active shipments</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge badge-overdue" style={{ padding: '8px 16px', fontSize: '13px' }}>
            🔴 At Risk: {redZone.length}
          </div>
          <div className="badge badge-safe" style={{ padding: '8px 16px', fontSize: '13px' }}>
            🟢 Safe: {safeZone.length}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <p className="card-subtitle">Active Shipments</p>
          <h3 className="card-value">{audits.length}</h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--danger)' }}>
          <p className="card-subtitle">Critical (&lt;30 days)</p>
          <h3 className="card-value" style={{ color: 'var(--danger)' }}>
            {sortedAudits.filter(a => getDaysLeft(a.deadline) <= 30).length}
          </h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--warning)' }}>
          <p className="card-subtitle">Warning (30-90 days)</p>
          <h3 className="card-value" style={{ color: 'var(--warning)' }}>
            {sortedAudits.filter(a => { const d = getDaysLeft(a.deadline); return d > 30 && d <= 90; }).length}
          </h3>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--success)' }}>
          <p className="card-subtitle">Safe (&gt;90 days)</p>
          <h3 className="card-value" style={{ color: 'var(--success)' }}>{safeZone.length}</h3>
        </div>
      </div>

      {/* Red Zone */}
      {redZone.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 className="section-title" style={{ color: 'var(--danger)' }}>🚨 Red Zone — Immediate Attention Required</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {redZone.map(audit => {
              const daysLeft = getDaysLeft(audit.deadline);
              const risk = getRiskLevel(daysLeft);
              const progress = getProgressPercent(daysLeft, audit.currency);

              return (
                <div key={audit._id} className={`risk-card ${risk}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '15px' }}>{audit.invoiceNumber}</span>
                        <span className={`badge badge-${risk}`}>
                          {risk === 'overdue' ? 'OVERDUE' : risk === 'danger' ? 'CRITICAL' : 'WARNING'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {audit.buyerName || 'Unknown Buyer'} · {audit.currency} · Due: {audit.deadline}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className={`countdown ${risk}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                      </div>
                    </div>
                  </div>

                  <div className="progress-bar" style={{ marginBottom: '12px' }}>
                    <div className={`progress-fill ${risk}`} style={{ width: `${progress}%` }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Realization period: {audit.currency === 'INR' ? '18' : '15'} months · Invoiced: {new Date(audit.invoiceDate).toLocaleDateString()}
                    </p>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={audit.bankClosed}
                        onChange={(e) => handleBankClosure(audit._id, e.target.checked)}
                      />
                      Payment received — close this shipment
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safe Zone */}
      {safeZone.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 className="section-title">✅ Active Shipments — On Track</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Buyer</th>
                  <th>Currency</th>
                  <th>Deadline</th>
                  <th>Days Left</th>
                  <th>Progress</th>
                  <th>Bank Closure</th>
                </tr>
              </thead>
              <tbody>
                {safeZone.map(audit => {
                  const daysLeft = getDaysLeft(audit.deadline);
                  const progress = getProgressPercent(daysLeft, audit.currency);

                  return (
                    <tr key={audit._id}>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{audit.invoiceNumber}</td>
                      <td>{audit.buyerName || '—'}</td>
                      <td>{audit.currency}</td>
                      <td>{audit.deadline}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>{daysLeft} days</span>
                      </td>
                      <td style={{ minWidth: '120px' }}>
                        <div className="progress-bar">
                          <div className="progress-fill safe" style={{ width: `${progress}%` }}></div>
                        </div>
                      </td>
                      <td>
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={audit.bankClosed}
                            onChange={(e) => handleBankClosure(audit._id, e.target.checked)}
                          />
                          Received
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {audits.length === 0 && (
        <div className="empty-state" style={{ marginBottom: '40px' }}>
          <div className="empty-state-icon">🛡️</div>
          <p className="empty-state-title">No active shipments</p>
          <p className="empty-state-desc">All shipments are either completed or no audits have been created yet.</p>
        </div>
      )}

      {/* Two column layout: Regulations + Alert Settings */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        {/* Regulation Updates */}
        <div>
          <h3 className="section-title">📰 Latest RBI Circulars</h3>
          <div className="regulation-feed">
            {REGULATIONS.map((reg, idx) => (
              <div key={idx} className="regulation-item">
                <p className="regulation-date">{reg.date}</p>
                <p className="regulation-title">{reg.title}</p>
                <p className="regulation-body">{reg.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Settings */}
        <div>
          <h3 className="section-title">🔔 Alert Settings</h3>
          <div className="settings-card">
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">WhatsApp Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 9876543210"
                value={alertSettings.phone}
                onChange={(e) => setAlertSettings({ ...alertSettings, phone: e.target.value })}
              />
              <p className="form-help">Receive deadline reminders via WhatsApp</p>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="alerts@company.com"
                value={alertSettings.email}
                onChange={(e) => setAlertSettings({ ...alertSettings, email: e.target.value })}
              />
              <p className="form-help">Receive compliance alerts via email</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <p className="form-label" style={{ marginBottom: '12px' }}>Notification Windows</p>

              <div className="settings-row">
                <div>
                  <p className="settings-label">90-Day Warning</p>
                  <p className="settings-desc">Alert when shipment enters the risk window</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alertSettings.alert90}
                    onChange={(e) => setAlertSettings({ ...alertSettings, alert90: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-row">
                <div>
                  <p className="settings-label">60-Day Warning</p>
                  <p className="settings-desc">Mid-range compliance reminder</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alertSettings.alert60}
                    onChange={(e) => setAlertSettings({ ...alertSettings, alert60: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="settings-row">
                <div>
                  <p className="settings-label">30-Day Critical Alert</p>
                  <p className="settings-desc">Urgent reminder — deadline approaching</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alertSettings.alert30}
                    onChange={(e) => setAlertSettings({ ...alertSettings, alert30: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px' }}
              onClick={saveAlertSettings}
            >
              {settingsSaved ? '✓ Saved Successfully' : 'Save Alert Preferences'}
            </button>

            {settingsSaved && (
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--success)', marginTop: '8px' }}>
                Settings saved. In production, alerts will be sent to your configured channels.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
