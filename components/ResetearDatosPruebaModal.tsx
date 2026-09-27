'use client';

import { useState } from 'react';
import { resetearDatosPrueba } from '@/lib/negocios';
import Button from './ui/Button';
import Input from './ui/Input';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-tarjeta p-6 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-texto">Resetear datos de prueba</h2>
        <p className="mb-4 text-sm text-texto-3">
          Se van a borrar de <strong>{negocioNombre}</strong>: ventas, presupuestos, movimientos de
          stock, cierres de caja y fiado. Los productos y los usuarios no se tocan. Esta acción no
          se puede deshacer.
        </p>

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
            {cargando ? 'Reseteando...' : 'Resetear datos de prueba'}
          </Button>
        </div>
      </form>
    </div>
  );
}
