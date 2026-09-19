'use client';

import { useState } from 'react';
import { eliminarNegocio, type EliminarNegocioResultado } from '@/lib/edgeFunctions';
import { formatearFechaHora } from '@/lib/fechas';

interface Props {
  negocioId: string;
  negocioNombre: string;
  solicitudEliminacionEn: string | null;
  onCerrar: () => void;
  onEliminado: (resultado: EliminarNegocioResultado) => void;
}

export default function EliminarNegocioModal({
  negocioId,
  negocioNombre,
  solicitudEliminacionEn,
  onCerrar,
  onEliminado,
}: Props) {
  const [confirmarNombre, setConfirmarNombre] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coincide = confirmarNombre === negocioNombre;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      const resultado = await eliminarNegocio(negocioId, confirmarNombre);
      onEliminado(resultado);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo eliminar el negocio');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-red-700">Eliminar cuenta</h2>
        <p className="mb-3 text-sm text-slate-600">
          Esto borra <strong>para siempre</strong> el negocio <strong>{negocioNombre}</strong>: sus
          productos, ventas, fiado, presupuestos y usuarios. No se puede deshacer. Esta acción es
          distinta de "Resetear datos de prueba" — acá no queda nada del negocio.
        </p>

        {solicitudEliminacionEn && (
          <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Este negocio pidió cerrar su cuenta el {formatearFechaHora(solicitudEliminacionEn)}
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <label className="mb-1 block text-sm font-medium text-slate-700">
          Para confirmar, escribí el nombre exacto: <span className="font-semibold">{negocioNombre}</span>
        </label>
        <input
          type="text"
          value={confirmarNombre}
          onChange={(e) => setConfirmarNombre(e.target.value)}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
            disabled={cargando}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando || !coincide}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {cargando ? 'Eliminando...' : 'Eliminar cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
}
