// components/BootstrapIcon.tsx
import React from 'react';

interface BootstrapIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BootstrapIcon: React.FC<BootstrapIconProps> = ({ 
  name, 
  size = 20, 
  color = 'currentColor',
  className = '',
  style = {}
}) => {
  return (
    <i 
      className={`bi bi-${name} ${className}`}
      style={{
        fontSize: `${size}px`,
        color,
        display: 'inline-block',
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style
      }}
    />
  );
};

export default BootstrapIcon;