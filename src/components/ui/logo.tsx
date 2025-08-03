import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto',
    xl: 'h-16 w-auto'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const LogoIcon = () => (
    <svg
      viewBox="0 0 40 40"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
      
      {/* Inner design - representing intelligence/brain/connections */}
      <g fill="white" fillOpacity="0.9">
        {/* Central node */}
        <circle cx="20" cy="20" r="3" />
        
        {/* Connection lines */}
        <path d="M20 17 L15 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 17 L25 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 23 L15 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 23 L25 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M17 20 L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M23 20 L32 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        
        {/* Outer nodes */}
        <circle cx="15" cy="12" r="2" />
        <circle cx="25" cy="12" r="2" />
        <circle cx="15" cy="28" r="2" />
        <circle cx="25" cy="28" r="2" />
        <circle cx="8" cy="20" r="2" />
        <circle cx="32" cy="20" r="2" />
        
        {/* Small accent dots */}
        <circle cx="12" cy="15" r="1" fillOpacity="0.6" />
        <circle cx="28" cy="15" r="1" fillOpacity="0.6" />
        <circle cx="12" cy="25" r="1" fillOpacity="0.6" />
        <circle cx="28" cy="25" r="1" fillOpacity="0.6" />
      </g>
    </svg>
  );

  const LogoText = () => (
    <span 
      className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${textSizeClasses[size]} ${className}`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      Geniq
    </span>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};

export default Logo;