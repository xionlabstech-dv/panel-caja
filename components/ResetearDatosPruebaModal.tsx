'use client';

import { useState } from 'react';
import { resetearDatosPrueba } from '@/lib/negocios';

interface Props {
  negocioId: string;
  negocioNombre: string;
  onCerrar: () => void;
  onListo: () => void;
}

export default function ResetearDatosPruebaModal({
  negocioId,
  negocioNombre,
  onCerrar,
  onListo,
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
      await resetearDatosPrueba(negocioId, confirmarNombre);
      onListo();
      onCerrar();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo resetear los datos de prueba');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Resetear datos de prueba</h2>
        <p className="mb-4 text-sm text-slate-600">
          Se van a borrar de <strong>{negocioNombre}</strong>: ventas, presupuestos, movimientos de
          stock, cierres de caja y fiado. Los productos y los usuarios no se tocan. Esta acción no
          se puede deshacer.
        </p>

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
            {cargando ? 'Reseteando...' : 'Resetear datos de prueba'}
          </button>
        </div>
      </form>
    </div>
  );
}
