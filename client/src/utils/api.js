const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Auth
export const login = (email, password) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(handleResponse);

export const register = (name, email, password, company) =>
  fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, company })
  }).then(handleResponse);

export const verifyToken = () =>
  fetch(`${API_BASE}/auth/verify`, {
    headers: getAuthHeaders()
  }).then(handleResponse);

export const forgotPassword = (email) =>
  fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(handleResponse);

export const resetPassword = (email, resetCode, newPassword) =>
  fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, resetCode, newPassword })
  }).then(handleResponse);

// Audits
export const fetchAudits = () =>
  fetch(`${API_BASE}/audits`, {
    headers: getAuthHeaders()
  }).then(handleResponse);

export const createAudit = (auditData) =>
  fetch(`${API_BASE}/audits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(auditData)
  }).then(handleResponse);

export const updateAudit = (id, updateData) =>
  fetch(`${API_BASE}/audits/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  }).then(handleResponse);

export const deleteAudit = (id) =>
  fetch(`${API_BASE}/audits/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }).then(handleResponse);

export const fetchComplianceAudits = () =>
  fetch(`${API_BASE}/audits/compliance`, {
    headers: getAuthHeaders()
  }).then(handleResponse);

// Payments
export const createPaymentOrder = (plan) =>
  fetch(`${API_BASE}/payments/create-order`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ plan })
  }).then(handleResponse);

export const verifyPayment = (paymentData) =>
  fetch(`${API_BASE}/payments/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData)
  }).then(handleResponse);

export const getPaymentStatus = () =>
  fetch(`${API_BASE}/payments/status`, {
    headers: getAuthHeaders()
  }).then(handleResponse);
