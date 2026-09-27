import type { Estado } from '@/lib/types';

const estilos: Record<Estado, string> = {
  activo: 'bg-marca-suave text-marca-suave-texto',
  restringido: 'bg-aviso-fondo text-aviso',
  suspendido: 'bg-negativo-fondo text-negativo',
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
