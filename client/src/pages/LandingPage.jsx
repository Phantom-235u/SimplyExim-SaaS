import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const LandingPage = () => {
  return (
    <div style={{ background: '#fff', color: '#1E293B', fontFamily: "'Inter', sans-serif" }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={34} />
          <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-1px', color: '#3A0CA3' }}>
            SIMPLY<span style={{ color: '#00D2FF' }}>EXIM</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/login" style={{
            padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: '#3A0CA3',
            border: '1px solid #E2E8F0', borderRadius: '8px', textDecoration: 'none',
            transition: '0.2s'
          }}>Sign In</Link>
          <Link to="/register" style={{
            padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: '#fff',
            background: '#3A0CA3', borderRadius: '8px', textDecoration: 'none',
            border: 'none', transition: '0.2s'
          }}>Start Free →</Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{
        padding: '100px 48px 80px', textAlign: 'center', position: 'relative',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #E8DEFF 60%, #E0F9FF 100%)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-200px', left: '-200px', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(58,12,163,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,210,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '50px',
            background: 'rgba(58,12,163,0.1)', color: '#3A0CA3', fontSize: '13px',
            fontWeight: 600, marginBottom: '24px', letterSpacing: '0.5px'
          }}>
            🏛️ Built for FEMA 2026 Regulations
          </div>

          <h1 style={{
            fontSize: '56px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px',
            marginBottom: '20px', color: '#0F172A'
          }}>
            Never Miss an <span style={{
              background: 'linear-gradient(135deg, #3A0CA3, #00D2FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>RBI Deadline</span> Again
          </h1>

          <p style={{
            fontSize: '20px', lineHeight: 1.7, color: '#475569',
            maxWidth: '600px', margin: '0 auto 36px'
          }}>
            Automated FEMA compliance for Indian exporters. Calculate realization deadlines, 
            track shipments, and stay ahead of EDPMS caution-listing — in one click.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" style={{
              padding: '16px 36px', fontSize: '16px', fontWeight: 700, color: '#fff',
              background: 'linear-gradient(135deg, #3A0CA3, #5B21B6)', borderRadius: '12px',
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(58,12,163,0.3)',
              transition: '0.3s', display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}>
              🚀 Start Free Trial
            </Link>
            <a href="#pricing" style={{
              padding: '16px 36px', fontSize: '16px', fontWeight: 600, color: '#3A0CA3',
              background: '#fff', borderRadius: '12px', textDecoration: 'none',
              border: '1px solid #E2E8F0', transition: '0.3s',
              display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}>
              View Pricing ↓
            </a>
          </div>

          <p style={{ marginTop: '20px', fontSize: '13px', color: '#94A3B8' }}>
            No credit card required · 2 free audits to try · Cancel anytime
          </p>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section style={{
        padding: '32px 48px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
          Trusted by exporters across India
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.4 }}>
          {['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Surat', 'Ahmedabad'].map(city => (
            <span key={city} style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', letterSpacing: '2px' }}>
              {city.toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section style={{ padding: '80px 48px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
          The Problem Every Exporter Faces
        </h2>
        <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.7 }}>
          One missed realization deadline = EDPMS caution-listing + withdrawal of export benefits. 
          No more tracking deadlines in spreadsheets.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '⏰', title: 'Deadline Tracking', desc: 'Auto-calculate 15-month (FC) and 18-month (INR) FEMA realization deadlines from invoice date.' },
            { icon: '🛡️', title: 'Compliance Monitor', desc: 'Live dashboard showing which shipments are at risk. Red zone alerts before you get caution-listed.' },
            { icon: '📄', title: 'Audit-Ready PDFs', desc: 'Generate professional compliance reports your CA and bank AD will accept. One click.' }
          ].map((f, i) => (
            <div key={i} style={{
              padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0',
              textAlign: 'left', transition: '0.3s', background: '#fff'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '80px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '48px', letterSpacing: '-1px' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { step: '01', title: 'Enter Invoice', desc: 'Enter buyer name, invoice date, and currency mode.' },
              { step: '02', title: 'Get Deadline', desc: 'System auto-calculates your FEMA realization deadline.' },
              { step: '03', title: 'Track & Monitor', desc: 'Compliance dashboard watches all your active shipments.' },
              { step: '04', title: 'Download Report', desc: 'Generate audit-ready PDFs for your CA and bank.' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #3A0CA3, #00D2FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: '16px'
                }}>{s.step}</div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{s.title}</h4>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ padding: '80px 48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>
            Simple, Honest Pricing
          </h2>
          <p style={{ fontSize: '18px', color: '#64748B' }}>
            Pay only for what you use. No hidden fees. No surprises.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
          {/* Pay Per Audit */}
          <div style={{
            padding: '36px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#fff',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '50px', fontSize: '11px',
              fontWeight: 600, background: '#E0F9FF', color: '#0369A1', marginBottom: '16px', alignSelf: 'flex-start'
            }}>STARTER</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Pay-Per-Audit</h3>
            <div style={{ margin: '16px 0' }}>
              <span style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A' }}>₹50</span>
              <span style={{ fontSize: '16px', color: '#64748B' }}> / audit</span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>
              Perfect for small exporters and "one-man" shops. Pay only when you generate a report.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
              {['1 PDF report per payment', 'FEMA deadline calculation', 'Audit-ready PDF download', 'Email support'].map((f, i) => (
                <li key={i} style={{ padding: '8px 0', fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#16A34A' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" style={{
              display: 'block', textAlign: 'center', padding: '14px', borderRadius: '10px',
              border: '1px solid #E2E8F0', color: '#3A0CA3', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none', transition: '0.2s'
            }}>Get Started →</Link>
          </div>

          {/* Monthly Guard — POPULAR */}
          <div style={{
            padding: '36px', borderRadius: '16px', background: 'linear-gradient(135deg, #3A0CA3, #5B21B6)',
            color: '#fff', position: 'relative', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(58,12,163,0.25)', transform: 'scale(1.04)'
          }}>
            <div style={{
              position: 'absolute', top: '-12px', right: '20px', padding: '6px 16px',
              borderRadius: '50px', fontSize: '11px', fontWeight: 700,
              background: '#00D2FF', color: '#0F172A', letterSpacing: '0.5px'
            }}>⭐ MOST POPULAR</div>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '50px', fontSize: '11px',
              fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: '16px', alignSelf: 'flex-start'
            }}>BEST VALUE</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Monthly Guard</h3>
            <div style={{ margin: '16px 0' }}>
              <span style={{ fontSize: '42px', fontWeight: 800 }}>₹499</span>
              <span style={{ fontSize: '16px', opacity: 0.8 }}> / month</span>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '24px', lineHeight: 1.5 }}>
              Best for steady income. They pay for the "peace of mind" that you are watching their dates.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
              {['Up to 20 active shipments', 'WhatsApp deadline alerts', 'Compliance dashboard', 'Excel export', 'Priority email support', 'Bank closure tracking'].map((f, i) => (
                <li key={i} style={{ padding: '8px 0', fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#00D2FF' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" style={{
              display: 'block', textAlign: 'center', padding: '14px', borderRadius: '10px',
              background: '#00D2FF', color: '#0F172A', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none', border: 'none', transition: '0.2s'
            }}>Start Free Trial →</Link>
          </div>

          {/* Enterprise */}
          <div style={{
            padding: '36px', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#fff',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: '50px', fontSize: '11px',
              fontWeight: 600, background: '#F0FDF4', color: '#16A34A', marginBottom: '16px', alignSelf: 'flex-start'
            }}>FACTORY SCALE</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px' }}>Enterprise</h3>
            <div style={{ margin: '16px 0' }}>
              <span style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A' }}>₹5,000</span>
              <span style={{ fontSize: '16px', color: '#64748B' }}> / month</span>
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>
              Best for large factories and trading houses with bulk shipments and CA coordination.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', flex: 1 }}>
              {['Unlimited shipments', 'Bulk CSV upload', 'CA (Chartered Accountant) login', 'WhatsApp + Email alerts', 'API access', 'Dedicated account manager'].map((f, i) => (
                <li key={i} style={{ padding: '8px 0', fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#16A34A' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" style={{
              display: 'block', textAlign: 'center', padding: '14px', borderRadius: '10px',
              border: '1px solid #E2E8F0', color: '#3A0CA3', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none', transition: '0.2s'
            }}>Contact Sales →</Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={{ padding: '80px 48px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-1px' }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: 'What happens if I miss the FEMA realization deadline?', a: 'RBI will auto caution-list your firm on EDPMS. You lose export benefits, can face penalties, and your AD bank will start asking difficult questions. SimplyExim prevents this.' },
            { q: 'Is the deadline 15 months or 18 months?', a: '15 months for shipments settled in foreign currency (USD, EUR, GBP, etc). 18 months for shipments settled in Indian Rupees (INR). SimplyExim auto-calculates based on your currency selection.' },
            { q: 'Can my Chartered Accountant use this?', a: 'Yes! On the Enterprise plan, your CA gets a separate login to view all your compliance data, download reports, and help with tax filing.' },
            { q: 'Is my data secure?', a: 'Absolutely. We use bank-grade encryption, your data is stored on MongoDB Atlas with enterprise security, and we never share your information with third parties.' },
          ].map((faq, i) => (
            <div key={i} style={{
              padding: '24px', borderRadius: '12px', background: '#fff',
              border: '1px solid #E2E8F0', marginBottom: '12px'
            }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#0F172A' }}>{faq.q}</h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{
        padding: '80px 48px', textAlign: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#fff'
      }}>
        <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
          Stop Risking Your Export License
        </h2>
        <p style={{ fontSize: '18px', opacity: 0.7, maxWidth: '500px', margin: '0 auto 36px' }}>
          Join hundreds of Indian exporters who sleep better knowing their FEMA deadlines are being watched.
        </p>
        <Link to="/register" style={{
          padding: '18px 48px', fontSize: '18px', fontWeight: 700, color: '#0F172A',
          background: '#00D2FF', borderRadius: '12px', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 24px rgba(0,210,255,0.3)'
        }}>
          Start Your Free Trial →
        </Link>
        <p style={{ marginTop: '16px', fontSize: '13px', opacity: 0.5 }}>
          2 free audits · No credit card · Set up in 60 seconds
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '40px 48px 24px', borderTop: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap', gap: '32px' }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
              SIMPLY<span style={{ color: '#00D2FF' }}>EXIM</span>
            </span>
            <p style={{ fontSize: '13px', marginTop: '8px', maxWidth: '250px', lineHeight: 1.6 }}>
              Automated FEMA 2026 compliance for the export-import community of India.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '48px' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '13px', marginBottom: '12px' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <span>Dashboard</span><span>Compliance</span><span>History</span>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '13px', marginBottom: '12px' }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <span>Privacy Policy</span><span>Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #1E293B', fontSize: '12px' }}>
          © 2026 SimplyExim. Built for Indian Exporters.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
