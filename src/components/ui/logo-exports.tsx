import React from 'react';

// Export individual logo components for specific use cases
export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 32 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    
    <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
    
    <g fill="white" fillOpacity="0.9">
      <circle cx="20" cy="20" r="3" />
      
      <path d="M20 17 L15 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 17 L25 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 23 L15 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 23 L25 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 20 L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 20 L32 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      
      <circle cx="15" cy="12" r="2" />
      <circle cx="25" cy="12" r="2" />
      <circle cx="15" cy="28" r="2" />
      <circle cx="25" cy="28" r="2" />
      <circle cx="8" cy="20" r="2" />
      <circle cx="32" cy="20" r="2" />
      
      <circle cx="12" cy="15" r="1" fillOpacity="0.6" />
      <circle cx="28" cy="15" r="1" fillOpacity="0.6" />
      <circle cx="12" cy="25" r="1" fillOpacity="0.6" />
      <circle cx="28" cy="25" r="1" fillOpacity="0.6" />
    </g>
  </svg>
);

export const LogoText: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <span 
      className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      Geniq
    </span>
  );
};

// Brand colors for consistent usage
export const brandColors = {
  primary: '#3B82F6',
  secondary: '#6366F1',
  accent: '#8B5CF6',
  gradient: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
  textGradient: 'linear-gradient(90deg, #1E40AF 0%, #7C3AED 100%)'
};

// Logo usage guidelines
export const logoGuidelines = {
  minSize: 24, // Minimum size in pixels
  clearSpace: 8, // Minimum clear space around logo
  backgrounds: {
    light: 'Use on light backgrounds',
    dark: 'Use on dark backgrounds', 
    colored: 'Ensure sufficient contrast'
  },
  formats: {
    web: 'SVG preferred for web',
    print: 'Vector formats for print',
    favicon: '32x32 minimum for favicons'
  }
};