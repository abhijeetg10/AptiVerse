import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40, withText = true }) => {
  return (
    <img 
      src="/logo.png" 
      alt="AptiVerse Logo" 
      style={{ height: size, width: 'auto' }}
      className={`shrink-0 drop-shadow-sm object-contain ${className}`} 
    />
  );
};
