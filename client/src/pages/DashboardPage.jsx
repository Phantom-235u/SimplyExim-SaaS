import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fetchAudits, createAudit } from '../utils/api';

const DashboardPage = () => {
  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [buyerName, setBuyerName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await fetchAudits();
      setHistory(data);
    } catch (err) {
      console.error('Could not fetch history');
    }
  };

  const calculate = async () => {
    if (!date) return alert('Select an Invoice Date');
    if (!buyerName.trim()) return alert('Enter a Buyer Name');

    setLoading(true);
    const months = currency === 'INR' ? 18 : 15;
    const resultDate = new Date(date + 'T00:00:00');
    resultDate.setMonth(resultDate.getMonth() + months);
    const finalDeadline = resultDate.toDateString();

    setDeadline(finalDeadline);

    const invoiceNumber = `SIMP-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await createAudit({
        invoiceNumber,
        buyerName: buyerName.trim(),
        invoiceDate: date,
        currency,
        amount: parseFloat(amount) || 0,
        deadline: finalDeadline
      });
      setReportData({ invoiceNumber, date, currency, deadline: finalDeadline, buyerName: buyerName.trim() });
      loadHistory();
    } catch (err) {
      console.error('Backend error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ExportGuard_Audit_${date}.pdf`);
  };

  const activeAudits = history.filter(h => h.status === 'Active').length;
  const completedAudits = history.filter(h => h.status === 'Completed').length;

  return (
    <div className="page animate-fade-in">
      {/* Stats Cards */}
      <div className="grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <p className="card-subtitle">Total Audits</p>
          <h3 className="card-value">{history.length}</h3>
        </div>
        <div className="stat-card">
          <p className="card-subtitle">Active Shipments</p>
          <h3 className="card-value" style={{ color: 'var(--primary)' }}>{activeAudits}</h3>
        </div>
        <div className="stat-card highlighted">
          <p className="card-subtitle">Completed</p>
          <h3 className="card-value">{completedAudits}</h3>
        </div>
      </div>

      {/* New Audit Form */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h3 className="card-title">New Shipment Audit</h3>
          <span className="badge badge-active">FEMA 2026</span>
        </div>
        <div className="form-grid-4">
          <div className="form-group">
            <label className="form-label">Buyer Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Buyer company name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Invoice Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Currency Mode</label>
            <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">Foreign Currency (USD/EUR/GBP)</option>
              <option value="INR">Indian Rupee (INR)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={calculate} disabled={loading}>
            {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }}></div> Processing...</> : '🚀 Run Audit'}
          </button>
        </div>
      </div>

      {/* Audit Report */}
      {deadline && reportData && (
        <div className="report-wrapper animate-slide-up">
          <div ref={reportRef} className="report-paper">
            <div className="report-header">
              <div>
                <h1 className="report-title">AUDIT REPORT</h1>
                <p className="report-ref">Reference: {reportData.invoiceNumber}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 className="report-brand">EXPORTGUARD</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}><strong>Buyer:</strong> {reportData.buyerName}</p>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}><strong>Shipment Date:</strong> {new Date(reportData.date).toLocaleDateString()}</p>
              <p style={{ fontSize: '16px' }}><strong>Payment Mode:</strong> {reportData.currency === 'INR' ? 'Domestic (INR)' : 'International (FC)'}</p>

              <div className="report-deadline-box">
                <h4 className="report-deadline-label">FEMA Realization Deadline</h4>
                <h1 className="report-deadline-date">{deadline}</h1>
                <p className="report-warning">⚠ ACTION REQUIRED PRIOR TO THIS DATE</p>
              </div>

              <div style={{ marginTop: '40px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <p><strong>Note:</strong> Generated per 2026 RBI Master Direction on Export of Goods and Services. Failure to repatriate proceeds within {reportData.currency === 'INR' ? '18' : '15'} months leads to automatic EDPMS caution-listing and withdrawal of export benefits.</p>
              </div>
            </div>
          </div>

          <button onClick={downloadPDF} className="btn btn-primary btn-lg" style={{ marginTop: '24px', borderRadius: 'var(--radius-full)' }}>
            📄 Download PDF Report
          </button>
        </div>
      )}

      {/* Recent History Preview */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="section-title">Recent Audits</h3>
          <a href="/history" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary)' }}>View All →</a>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Buyer</th>
                <th>Invoice Date</th>
                <th>Currency</th>
                <th>RBI Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.slice(0, 5).map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{item.invoiceNumber}</td>
                  <td>{item.buyerName || '—'}</td>
                  <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>
                  <td>{item.currency}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{item.deadline}</td>
                  <td>
                    <span className={`badge badge-${item.status?.toLowerCase() || 'active'}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state" style={{ padding: '30px' }}>
                      <p className="empty-state-desc">No audits yet. Run your first audit above.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
