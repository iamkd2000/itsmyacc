import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        className={`appearance-none block w-full px-3 py-3 border ${error ? 'border-red-500' : 'border-slate-700'} bg-slate-900 text-white rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};