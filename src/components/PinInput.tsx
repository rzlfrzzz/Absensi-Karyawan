import React from 'react';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PinInput: React.FC<PinInputProps> = ({ value, onChange, placeholder = '••••' }) => {
  return (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={4}
      className="w-full bg-slate-50 border border-slate-100 text-center text-4xl tracking-[1.5rem] py-5 rounded-3xl mb-6 focus:ring-4 focus:ring-indigo-100 outline-none font-mono text-slate-800"
    />
  );
};
