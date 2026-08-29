import type { Estado } from '@/lib/types';

const estilos: Record<Estado, string> = {
  activo: 'bg-emerald-100 text-emerald-800',
  restringido: 'bg-amber-100 text-amber-800',
  suspendido: 'bg-red-100 text-red-800',
};

const etiquetas: Record<Estado, string> = {
  activo: 'Activo',
  restringido: 'Restringido',
  suspendido: 'Suspendido',
};

export default function EstadoBadge({ estado }: { estado: Estado }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estilos[estado]}`}>
      {etiquetas[estado]}
    </span>
  );
}
