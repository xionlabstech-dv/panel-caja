'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', id, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-texto-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          'w-full rounded-md border bg-tarjeta px-3 py-2 text-sm text-texto',
          'placeholder:text-texto-4 outline-none transition-colors',
          error ? 'border-negativo' : 'border-borde-campo focus:border-foco',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-negativo">{error}</p>}
    </div>
  );
});

export default Input;
