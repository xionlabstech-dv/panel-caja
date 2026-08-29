'use client';

import { useState } from 'react';
import type { Estado, Negocio } from '@/lib/types';
import { cambiarEstado, actualizarFechaPago } from '@/lib/negocios';
import { formatearFechaHora } from '@/lib/fechas';
import EstadoBadge from './EstadoBadge';
import ConfirmModal from './ConfirmModal';

interface Props {
  negocio: Negocio;
  onCerrar: () => void;
  onActualizado: () => void;
}

const ESTADOS: { valor: Estado; etiqueta: string }[] = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'restringido', etiqueta: 'Restringido' },
  { valor: 'suspendido', etiqueta: 'Suspendido' },
];

export default function NegocioDetalle({ negocio, onCerrar, onActualizado }: Props) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Estado>(negocio.estado);
  const [nota, setNota] = useState(negocio.estado_nota ?? '');
  const [fechaPago, setFechaPago] = useState(negocio.fecha_proximo_pago ?? '');
  const [pendienteConfirmar, setPendienteConfirmar] = useState<Estado | null>(null);
  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const [guardandoFecha, setGuardandoFecha] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function aplicarCambioEstado(estado: Estado) {
    setError(null);
    setAviso(null);
    setGuardandoEstado(true);
    try {
      await cambiarEstado(negocio.id, estado, nota);
      setAviso('Estado actualizado.');
      setPendienteConfirmar(null);
      onActualizado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo cambiar el estado');
    } finally {
      setGuardandoEstado(false);
    }
  }

  function onElegirEstado(estado: Estado) {
    if (estado === estadoSeleccionado) return;
    setEstadoSeleccionado(estado);
    if (estado === 'restringido' || estado === 'suspendido') {
      setPendienteConfirmar(estado);
    } else {
      aplicarCambioEstado(estado);
    }
  }

  async function guardarFecha() {
    setError(null);
    setAviso(null);
    setGuardandoFecha(true);
    try {
      await actualizarFechaPago(negocio.id, fechaPago);
      setAviso('Fecha de próximo pago actualizada.');
      onActualizado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo actualizar la fecha');
    } finally {
      setGuardandoFecha(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{negocio.nombre}</h2>
            <div className="mt-1">
              <EstadoBadge estado={negocio.estado} />
            </div>
          </div>
          <button onClick={onCerrar} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        {aviso && (
          <div className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {aviso}
          </div>
        )}

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-slate-700">Estado del servicio</h3>
          <div className="flex gap-2">
            {ESTADOS.map((e) => (
              <button
                key={e.valor}
                onClick={() => onElegirEstado(e.valor)}
                disabled={guardandoEstado}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                  negocio.estado === e.valor
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {e.etiqueta}
              </button>
            ))}
          </div>
          <label className="mb-1 mt-4 block text-sm font-medium text-slate-700">
            Nota interna (no la ve el comercio)
          </label>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            placeholder="Ej: debe el mes de agosto, prometió pagar el viernes"
          />
          <p className="mt-1 text-xs text-slate-400">
            La nota se guarda junto con el próximo cambio de estado que apliques.
          </p>
          {negocio.estado_actualizado_en && (
            <p className="mt-2 text-xs text-slate-400">
              Último cambio: {formatearFechaHora(negocio.estado_actualizado_en)}
            </p>
          )}
        </section>

        <section className="mb-6 border-t border-slate-200 pt-6">
          <h3 className="mb-2 text-sm font-medium text-slate-700">Próximo pago</h3>
          <div className="flex gap-2">
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            <button
              onClick={guardarFecha}
              disabled={guardandoFecha || !fechaPago}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {guardandoFecha ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </section>

        <section className="border-t border-slate-200 pt-6">
          <h3 className="mb-2 text-sm font-medium text-slate-700">Usuarios activos</h3>
          <p className="text-2xl font-semibold text-slate-900">{negocio.cantidad_usuarios}</p>
        </section>

        {pendienteConfirmar && (
          <ConfirmModal
            titulo={
              pendienteConfirmar === 'suspendido'
                ? `¿Suspender ${negocio.nombre}?`
                : `¿Restringir ${negocio.nombre}?`
            }
            mensaje={
              pendienteConfirmar === 'suspendido'
                ? 'El comercio perderá acceso completo a la app y verá "Servicio pausado". Esta acción afecta a un negocio real.'
                : 'El comercio podrá seguir vendiendo y cerrando caja, pero perderá acceso a inventario, movimientos, reportes y anulaciones.'
            }
            confirmarTexto={pendienteConfirmar === 'suspendido' ? 'Suspender' : 'Restringir'}
            cargando={guardandoEstado}
            onCancelar={() => {
              setPendienteConfirmar(null);
              setEstadoSeleccionado(negocio.estado);
            }}
            onConfirmar={() => aplicarCambioEstado(pendienteConfirmar)}
          />
        )}
      </div>
    </div>
  );
}
