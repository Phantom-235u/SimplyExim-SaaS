import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { forgotPassword } from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setSuccess(data.message);
      // In demo mode, show the reset code
      if (data._demoResetCode) {
        setResetCode(data._demoResetCode);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide-up">
        <div className="auth-logo">
          <Logo size={42} />
          <h2>EXPORT<span>GUARD</span></h2>
        </div>

        <h3 className="auth-title">Forgot password?</h3>
        <p className="auth-subtitle">Enter your email and we'll generate a reset code</p>

        {error && <div className="auth-alert error">{error}</div>}
        {success && <div className="auth-alert success">{success}</div>}

        {resetCode && (
          <div className="auth-alert info" style={{ marginTop: '12px' }}>
            <strong>Demo Mode — Your reset code:</strong>
            <div style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', margin: '8px 0', letterSpacing: '6px', fontVariantNumeric: 'tabular-nums' }}>
              {resetCode}
            </div>
            <p style={{ fontSize: '12px', margin: 0 }}>In production, this would be sent to your email.</p>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
            >
              Enter Reset Code →
            </button>
          </div>
        )}

        {!resetCode && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? <><div className="spinner" style={{ borderTopColor: 'white' }}></div> Sending...</> : 'Send Reset Code'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
