import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-3 border text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500",
    secondary: "border-slate-600 text-slate-200 bg-slate-800 hover:bg-slate-700 focus:ring-primary-500",
    danger: "border-transparent text-white bg-credit-600 hover:bg-credit-500 focus:ring-credit-500",
    success: "border-transparent text-white bg-payment-600 hover:bg-payment-500 focus:ring-payment-500",
    outline: "border-primary-600 text-primary-400 bg-transparent hover:bg-primary-900/20 focus:ring-primary-500",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};