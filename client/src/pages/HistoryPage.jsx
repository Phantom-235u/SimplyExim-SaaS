import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { fetchAudits } from '../utils/api';

const ITEMS_PER_PAGE = 20;

const HistoryPage = () => {
  const [audits, setAudits] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  useEffect(() => {
    loadAudits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [audits, search, monthFilter, statusFilter]);

  const loadAudits = async () => {
    setLoading(true);
    try {
      const data = await fetchAudits();
      // Sort oldest to newest for history view
      setAudits(data.reverse());
    } catch (err) {
      console.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...audits];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.invoiceNumber?.toLowerCase().includes(q) ||
        a.buyerName?.toLowerCase().includes(q)
      );
    }

    if (monthFilter) {
      const [year, month] = monthFilter.split('-');
      result = result.filter(a => {
        const d = new Date(a.invoiceDate);
        return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
      });
    }

    if (statusFilter) {
      result = result.filter(a => a.status === statusFilter);
    }

    setFiltered(result);
    setPage(1);
  };

  const paginatedData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const downloadPDFForAudit = async (audit) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '25mm';
    tempDiv.style.background = 'white';
    tempDiv.style.fontFamily = 'Inter, sans-serif';
    tempDiv.innerHTML = `
      <div style="border-bottom: 4px solid #3A0CA3; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; color: #3A0CA3; font-size: 32px;">AUDIT REPORT</h1>
          <p style="margin: 0; color: #94A3B8;">Reference: ${audit.invoiceNumber}</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; color: #00D2FF;">EXPORTGUARD</h2>
          <p style="margin: 0; font-size: 12px;">${new Date(audit.created).toLocaleDateString()}</p>
        </div>
      </div>
      <div style="margin-top: 40px;">
        <p style="font-size: 16px; margin-bottom: 8px;"><strong>Buyer:</strong> ${audit.buyerName || 'N/A'}</p>
        <p style="font-size: 16px; margin-bottom: 8px;"><strong>Shipment Date:</strong> ${new Date(audit.invoiceDate).toLocaleDateString()}</p>
        <p style="font-size: 16px;"><strong>Payment Mode:</strong> ${audit.currency === 'INR' ? 'Domestic (INR)' : 'International (FC)'}</p>
        <div style="margin-top: 40px; padding: 40px; background: #F1F5F9; border-radius: 12px; border-left: 8px solid #3A0CA3;">
          <h4 style="color: #94A3B8; margin: 0; text-transform: uppercase;">FEMA Realization Deadline</h4>
          <h1 style="font-size: 48px; margin: 10px 0; color: #1E293B;">${audit.deadline}</h1>
          <p style="margin: 0; color: #DC2626; font-weight: 600;">⚠ ACTION REQUIRED PRIOR TO THIS DATE</p>
        </div>
        <div style="margin-top: 40px; font-size: 13px; color: #94A3B8; line-height: 1.7;">
          <p><strong>Note:</strong> Generated per 2026 RBI Master Direction on Export of Goods and Services.</p>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);
    const canvas = await html2canvas(tempDiv, { scale: 3 });
    document.body.removeChild(tempDiv);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`ExportGuard_${audit.invoiceNumber}.pdf`);
  };

  const exportToExcel = () => {
    const exportData = filtered.map(a => ({
      'Invoice Number': a.invoiceNumber,
      'Buyer Name': a.buyerName || '',
      'Invoice Date': new Date(a.invoiceDate).toLocaleDateString(),
      'Currency': a.currency,
      'Amount': a.amount || 0,
      'RBI Deadline': a.deadline,
      'Status': a.status,
      'Bank Closed': a.bankClosed ? 'Yes' : 'No',
      'Created': new Date(a.created).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit History');

    // Auto-fit column widths
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...exportData.map(row => String(row[key]).length)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `ExportGuard_History_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getDaysLeft = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  };

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
          <h1 className="page-title">📋 Audit History</h1>
          <p className="page-subtitle">Complete record of all shipment audits — {filtered.length} entries</p>
        </div>
        <button className="btn btn-primary" onClick={exportToExcel} disabled={filtered.length === 0}>
          📥 Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input"
            placeholder="Search by invoice number or buyer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <div className="form-group" style={{ minWidth: '180px' }}>
          <input
            type="month"
            className="form-input"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: '160px' }}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        {(search || monthFilter || statusFilter) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setMonthFilter(''); setStatusFilter(''); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Buyer Name</th>
              <th>Invoice Date</th>
              <th>Currency</th>
              <th>Amount</th>
              <th>RBI Deadline</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? paginatedData.map((item) => {
              const daysLeft = getDaysLeft(item.deadline);
              return (
                <React.Fragment key={item._id}>
                  <tr>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{item.invoiceNumber}</td>
                    <td>{item.buyerName || '—'}</td>
                    <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>
                    <td>{item.currency}</td>
                    <td>{item.amount ? `${item.currency === 'INR' ? '₹' : '$'}${item.amount.toLocaleString()}` : '—'}</td>
                    <td style={{ fontWeight: 600, color: daysLeft < 0 ? 'var(--danger)' : daysLeft < 90 ? 'var(--warning)' : 'var(--text)' }}>
                      {item.deadline}
                    </td>
                    <td>
                      {item.bankClosed ? (
                        <span className="badge badge-completed">✓ Closed</span>
                      ) : daysLeft < 0 ? (
                        <span className="badge badge-overdue">Overdue</span>
                      ) : (
                        <span style={{ fontWeight: 600, color: daysLeft < 30 ? 'var(--danger)' : daysLeft < 90 ? 'var(--warning)' : 'var(--success)' }}>
                          {daysLeft} days
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${(item.status || 'active').toLowerCase()}`}>
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                        >
                          {expandedId === item._id ? 'Hide' : 'Details'}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => downloadPDFForAudit(item)}
                          title="Re-download PDF"
                        >
                          📄
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === item._id && (
                    <tr>
                      <td colSpan="9" style={{ padding: '0 20px 16px' }}>
                        <div className="detail-panel animate-fade-in">
                          <div className="detail-row">
                            <span className="detail-label">Invoice Number</span>
                            <span className="detail-value">{item.invoiceNumber}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Buyer Name</span>
                            <span className="detail-value">{item.buyerName || 'N/A'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Invoice Date</span>
                            <span className="detail-value">{new Date(item.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Payment Mode</span>
                            <span className="detail-value">{item.currency === 'INR' ? 'Indian Rupee (Domestic)' : `Foreign Currency (${item.currency})`}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Amount</span>
                            <span className="detail-value">{item.amount ? `${item.currency === 'INR' ? '₹' : '$'}${item.amount.toLocaleString()}` : 'Not specified'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">FEMA Deadline</span>
                            <span className="detail-value" style={{ color: 'var(--danger)', fontWeight: 700 }}>{item.deadline}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Realization Period</span>
                            <span className="detail-value">{item.currency === 'INR' ? '18 months' : '15 months'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Bank Closure</span>
                            <span className="detail-value">{item.bankClosed ? `Closed on ${new Date(item.bankClosedDate).toLocaleDateString()}` : 'Pending'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Audit Created</span>
                            <span className="detail-value">{new Date(item.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            }) : (
              <tr>
                <td colSpan="9">
                  <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <p className="empty-state-title">No audits found</p>
                    <p className="empty-state-desc">
                      {search || monthFilter || statusFilter
                        ? 'Try adjusting your filters.'
                        : 'Run your first audit from the Dashboard.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ← Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`pagination-btn ${p === page ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
