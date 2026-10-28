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

// Cuenta días de calendario, no períodos de 24 horas: una venta de ayer a las
// 11pm es "ayer", aunque hayan pasado solo 9 horas. Restar milisegundos crudos
// decía "hoy" en ese caso — el error siempre hacía parecer el negocio más
// activo de lo que es. `fechaISO` es un timestamptz (viene con offset de UTC),
// así que `new Date` ya resuelve el instante absoluto; el `setHours` lo lleva
// a la medianoche local del día en que ocurrió la venta, para comparar día
// contra día como hace `diasHasta`.
export function ultimaVentaRelativa(fechaISO: string | null): string {
  if (!fechaISO) return 'Sin ventas';
  const fecha = new Date(fechaISO);
  fecha.setHours(0, 0, 0, 0);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  // Math.round, no Math.floor: con las dos fechas en medianoche la división da
  // un entero exacto salvo en una zona con horario de verano, donde un día
  // puede durar 23 o 25 horas (Venezuela no tiene, pero el panel se abre desde
  // donde sea). dias <= 0, no === 0: si el reloj del navegador está atrasado,
  // "hoy" es mejor que "hace -1 días".
  const dias = Math.round((hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  return `hace ${dias} días`;
}
