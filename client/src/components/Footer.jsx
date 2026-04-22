import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <h2>SIMPLY<span>EXIM</span></h2>
        <p>Empowering Indian exporters with real-time compliance automation and FEMA 2026 monitoring.</p>
      </div>
      <div>
        <h4>Platform</h4>
        <ul className="footer-links">
          <li>Compliance Calculator</li>
          <li>Shipment History</li>
          <li>Document Vault</li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul className="footer-links">
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
        </ul>
      </div>
      <div>
        <h4>Stay Updated</h4>
        <div className="footer-newsletter">
          <input type="email" placeholder="Your email" />
          <button>Join</button>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 SimplyExim. Built for the Export-Import community of India.</p>
    </div>
  </footer>
);

export default Footer;
