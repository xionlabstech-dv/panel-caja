'use client';

import { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'destructivo';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  compacto?: boolean;
}

const CLASES_VARIANTE: Record<Variante, string> = {
  primario: 'bg-marca text-texto-invertido active:bg-marca-presion',
  secundario: 'border border-borde-campo text-texto-2 active:bg-tarjeta-hundida',
  destructivo: 'bg-negativo text-texto-invertido active:brightness-90',
};

export default function Button({
  variante = 'primario',
  compacto = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        'rounded-md font-medium text-sm transition-colors',
        'flex items-center justify-center gap-2 px-4',
        compacto ? 'h-9' : 'h-11',
        CLASES_VARIANTE[variante],
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
