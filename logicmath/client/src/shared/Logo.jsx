import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <defs>
      <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" /> {/* sky-400 */}
        <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
      </linearGradient>
      <linearGradient id="logo-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#818cf8" /> {/* indigo-400 */}
        <stop offset="100%" stopColor="#c084fc" /> {/* purple-400 */}
      </linearGradient>
    </defs>
    
    {/* Outer Hexagon */}
    <path 
      d="M50 5 L93 30 L93 70 L50 95 L7 70 L7 30 Z" 
      stroke="url(#logo-grad-1)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Inner Geometry (creates a 3D isometric cube effect) */}
    <path 
      d="M50 5 L50 50 L93 70" 
      stroke="url(#logo-grad-2)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M7 70 L50 50 L7 30" 
      stroke="url(#logo-grad-1)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Center Node */}
    <circle cx="50" cy="50" r="8" fill="url(#logo-grad-2)" />
  </svg>
);

export default Logo;
