import React from 'react';

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="23" stroke="#3A0CA3" strokeWidth="2" fill="#F3EEFF" />
    <path d="M15 30L25 15L35 30H15Z" fill="#00D2FF" />
    <rect x="22" y="30" width="6" height="8" fill="#3A0CA3" />
  </svg>
);

export default Logo;
