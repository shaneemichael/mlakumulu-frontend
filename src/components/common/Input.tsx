import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className,
  helperText,
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  const id = props.id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label htmlFor={id} className="block text-gray-700 font-medium mb-1.5 text-sm">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`border rounded-md px-3.5 py-2.5 ${widthClass} text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        } ${className || ''}`}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;