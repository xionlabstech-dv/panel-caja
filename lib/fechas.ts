export function diasHasta(fechaISO: string | null): number | null {
  if (!fechaISO) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(fechaISO + 'T00:00:00');
  const diffMs = fecha.getTime() - hoy.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatearFecha(fechaISO: string | null): string {
  if (!fechaISO) return 'Sin fecha';
  const fecha = new Date(fechaISO + 'T00:00:00');
  return fecha.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatearFechaHora(fechaISO: string | null): string {
  if (!fechaISO) return '—';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// `fechaISO` es un timestamptz (viene con offset de UTC), así que `new Date`
// lo resuelve a un instante absoluto sin importar la zona del navegador — a
// diferencia de `diasHasta`, que trabaja con fechas sin hora y por eso le
// suma 'T00:00:00' para fijarlas a medianoche local.
export function ultimaVentaRelativa(fechaISO: string | null): string {
  if (!fechaISO) return 'Sin ventas';
  const fecha = new Date(fechaISO);
  const diffDias = Math.floor((Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDias <= 0) return 'hoy';
  if (diffDias === 1) return 'ayer';
  return `hace ${diffDias} días`;
}
