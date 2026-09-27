'use client';

import { useState } from 'react';
import { eliminarNegocio, type EliminarNegocioResultado } from '@/lib/edgeFunctions';
import { formatearFechaHora } from '@/lib/fechas';
import Button from './ui/Button';
import Input from './ui/Input';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-tarjeta p-6 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-negativo">Eliminar cuenta</h2>
        <p className="mb-3 text-sm text-texto-3">
          Esto borra <strong>para siempre</strong> el negocio <strong>{negocioNombre}</strong>: sus
          productos, ventas, fiado, presupuestos y usuarios. No se puede deshacer. Esta acción es
          distinta de "Resetear datos de prueba" — acá no queda nada del negocio.
        </p>

        {solicitudEliminacionEn && (
          <p className="mb-3 rounded-md bg-aviso-fondo px-3 py-2 text-xs text-aviso">
            Este negocio pidió cerrar su cuenta el {formatearFechaHora(solicitudEliminacionEn)}
          </p>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
        )}

        <label className="mb-1 block text-sm font-medium text-texto-2">
          Para confirmar, escribí el nombre exacto: <span className="font-semibold">{negocioNombre}</span>
        </label>
        <Input
          type="text"
          value={confirmarNombre}
          onChange={(e) => setConfirmarNombre(e.target.value)}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variante="secundario" compacto onClick={onCerrar} disabled={cargando}>
            Cancelar
          </Button>
          <Button type="submit" variante="destructivo" compacto disabled={cargando || !coincide}>
            {cargando ? 'Eliminando...' : 'Eliminar cuenta'}
          </Button>
        </div>
      </form>
    </div>
  );
}
