'use client';

import { useState } from 'react';
import type { Estado, Negocio } from '@/lib/types';
import {
  cambiarEstado,
  actualizarFechaPago,
  actualizarPrecio,
  actualizarLimiteUsuarios,
  actualizarLimiteProductos,
  actualizarEsPrueba,
} from '@/lib/negocios';
import { formatearFechaHora } from '@/lib/fechas';
import EstadoBadge from './EstadoBadge';
import ConfirmModal from './ConfirmModal';
import UsuariosSeccion from './UsuariosSeccion';
import ResetearDatosPruebaModal from './ResetearDatosPruebaModal';
import EliminarNegocioModal from './EliminarNegocioModal';
import type { EliminarNegocioResultado } from '@/lib/edgeFunctions';
import Button from './ui/Button';

interface Props {
  negocio: Negocio;
  onCerrar: () => void;
  onActualizado: () => void;
  onEliminado: (resultado: EliminarNegocioResultado) => void;
}

const ESTADOS: { valor: Estado; etiqueta: string }[] = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'restringido', etiqueta: 'Restringido' },
  { valor: 'suspendido', etiqueta: 'Suspendido' },
];

export default function NegocioDetalle({ negocio, onCerrar, onActualizado, onEliminado }: Props) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<Estado>(negocio.estado);
  const [nota, setNota] = useState(negocio.estado_nota ?? '');
  const [fechaPago, setFechaPago] = useState(negocio.fecha_proximo_pago ?? '');
  const [precio, setPrecio] = useState(negocio.precio_mensual?.toString() ?? '');
  const [limiteUsuarios, setLimiteUsuarios] = useState(negocio.limite_usuarios.toString());
  const [limiteProductos, setLimiteProductos] = useState(negocio.limite_productos?.toString() ?? '');
  const [pendienteConfirmar, setPendienteConfirmar] = useState<Estado | null>(null);
  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const [guardandoFecha, setGuardandoFecha] = useState(false);
  const [guardandoPrecio, setGuardandoPrecio] = useState(false);
  const [guardandoLimiteUsuarios, setGuardandoLimiteUsuarios] = useState(false);
  const [guardandoLimiteProductos, setGuardandoLimiteProductos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [mostrarResetearPrueba, setMostrarResetearPrueba] = useState(false);
  const [guardandoEsPrueba, setGuardandoEsPrueba] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

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

  async function guardarPrecio() {
    setError(null);
    setAviso(null);
    setGuardandoPrecio(true);
    try {
      await actualizarPrecio(negocio.id, precio.trim() === '' ? null : Number(precio));
      setAviso('Precio mensual actualizado.');
      onActualizado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo actualizar el precio');
    } finally {
      setGuardandoPrecio(false);
    }
  }

  async function guardarLimiteUsuarios() {
    setError(null);
    setAviso(null);
    setGuardandoLimiteUsuarios(true);
    try {
      await actualizarLimiteUsuarios(negocio.id, Number(limiteUsuarios));
      setAviso('Límite de usuarios actualizado.');
      onActualizado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo actualizar el límite de usuarios');
    } finally {
      setGuardandoLimiteUsuarios(false);
    }
  }

  async function guardarLimiteProductos() {
    setError(null);
    setAviso(null);
    setGuardandoLimiteProductos(true);
    try {
      await actualizarLimiteProductos(
        negocio.id,
        limiteProductos.trim() === '' ? null : Number(limiteProductos),
      );
      setAviso('Límite de productos actualizado.');
      onActualizado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo actualizar el límite de productos');
    } finally {
      setGuardandoLimiteProductos(false);
    }
  }

  async function toggleEsPrueba() {
    setError(null);
    setAviso(null);
    setGuardandoEsPrueba(true);
    try {
      await actualizarEsPrueba(negocio.id, !negocio.es_prueba);
      setAviso(negocio.es_prueba ? 'Ya no es una cuenta de prueba.' : 'Marcada como cuenta de prueba.');
      onActualizado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo actualizar la cuenta de prueba');
    } finally {
      setGuardandoEsPrueba(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-overlay">
      <div className="h-full w-full max-w-md overflow-y-auto bg-tarjeta p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-texto">{negocio.nombre}</h2>
            <div className="mt-1">
              <EstadoBadge estado={negocio.estado} />
            </div>
          </div>
          <button onClick={onCerrar} className="text-texto-4 hover:text-texto">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
        )}
        {aviso && (
          <div className="mb-4 rounded-md bg-marca-suave px-3 py-2 text-sm text-marca-suave-texto">
            {aviso}
          </div>
        )}

        <p className="mb-6 text-sm text-texto-3">
          Nombre comercial:{' '}
          <span className="font-medium text-texto">
            {negocio.nombre_comercial ?? 'Sin definir'}
          </span>
        </p>

        {negocio.solicitud_eliminacion_en && (
          <div className="mb-6 rounded-md bg-aviso-fondo px-3 py-2 text-sm font-medium text-aviso">
            Pidió cerrar la cuenta el {formatearFechaHora(negocio.solicitud_eliminacion_en)}
          </div>
        )}

        <section className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-texto-2">Estado del servicio</h3>
          <div className="flex gap-2">
            {ESTADOS.map((e) => (
              <button
                key={e.valor}
                onClick={() => onElegirEstado(e.valor)}
                disabled={guardandoEstado}
                className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                  negocio.estado === e.valor
                    ? 'border-marca bg-marca text-texto-invertido'
                    : 'border-borde-campo text-texto-2 hover:bg-tarjeta-hundida'
                }`}
              >
                {e.etiqueta}
              </button>
            ))}
          </div>
          <label className="mb-1 mt-4 block text-sm font-medium text-texto-2">
            Nota interna (no la ve el comercio)
          </label>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-borde-campo bg-tarjeta px-3 py-2 text-sm text-texto focus:border-foco focus:outline-none"
            placeholder="Ej: debe el mes de agosto, prometió pagar el viernes"
          />
          <p className="mt-1 text-xs text-texto-4">
            La nota se guarda junto con el próximo cambio de estado que apliques.
          </p>
          {negocio.estado_actualizado_en && (
            <p className="mt-2 text-xs text-texto-4">
              Último cambio: {formatearFechaHora(negocio.estado_actualizado_en)}
            </p>
          )}
        </section>

        <section className="mb-6 border-t border-borde-divisor pt-6">
          <h3 className="mb-2 text-sm font-medium text-texto-2">Próximo pago</h3>
          <div className="flex gap-2">
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="flex-1 rounded-md border border-borde-campo bg-tarjeta px-3 py-2 text-sm text-texto focus:border-foco focus:outline-none"
            />
            <Button variante="primario" compacto onClick={guardarFecha} disabled={guardandoFecha || !fechaPago}>
              {guardandoFecha ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </section>

        <section className="mb-6 border-t border-borde-divisor pt-6">
          <h3 className="mb-2 text-sm font-medium text-texto-2">Facturación y límites</h3>

          <label className="mb-1 block text-sm text-texto-3">Precio mensual (USD)</label>
          <div className="mb-4 flex gap-2">
            <input
              type="number"
              min={0}
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Sin definir"
              className="flex-1 rounded-md border border-borde-campo bg-tarjeta px-3 py-2 text-sm text-texto focus:border-foco focus:outline-none"
            />
            <Button variante="primario" compacto onClick={guardarPrecio} disabled={guardandoPrecio}>
              {guardandoPrecio ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>

          <label className="mb-1 block text-sm text-texto-3">Límite de usuarios</label>
          <div className="mb-4 flex gap-2">
            <input
              type="number"
              min={1}
              step="1"
              value={limiteUsuarios}
              onChange={(e) => setLimiteUsuarios(e.target.value)}
              className="flex-1 rounded-md border border-borde-campo bg-tarjeta px-3 py-2 text-sm text-texto focus:border-foco focus:outline-none"
            />
            <Button
              variante="primario"
              compacto
              onClick={guardarLimiteUsuarios}
              disabled={guardandoLimiteUsuarios || limiteUsuarios.trim() === ''}
            >
              {guardandoLimiteUsuarios ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>

          <label className="mb-1 block text-sm text-texto-3">Límite de productos</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              step="1"
              value={limiteProductos}
              onChange={(e) => setLimiteProductos(e.target.value)}
              placeholder="Sin límite"
              className="flex-1 rounded-md border border-borde-campo bg-tarjeta px-3 py-2 text-sm text-texto focus:border-foco focus:outline-none"
            />
            <Button variante="primario" compacto onClick={guardarLimiteProductos} disabled={guardandoLimiteProductos}>
              {guardandoLimiteProductos ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
          <p className="mt-1 text-xs text-texto-4">
            Todavía no se hace cumplir automáticamente. Es solo referencia.
          </p>

          <p className="mt-4 text-sm text-texto-3">
            Productos cargados: <span className="font-medium text-texto">{negocio.cantidad_productos}</span>
          </p>
        </section>

        <UsuariosSeccion negocioId={negocio.id} negocioNombre={negocio.nombre} />

        <section className="mb-6 border-t border-borde-divisor pt-6">
          <h3 className="mb-2 text-sm font-medium text-texto-2">Cuenta de prueba</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-texto-3">
              {negocio.es_prueba
                ? 'Esta cuenta está marcada como de prueba.'
                : 'Esta cuenta no está marcada como de prueba.'}
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={negocio.es_prueba}
              onClick={toggleEsPrueba}
              disabled={guardandoEsPrueba}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                negocio.es_prueba ? 'bg-marca' : 'bg-tarjeta-hundida'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-tarjeta transition-transform ${
                  negocio.es_prueba ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </section>

        <section className="mb-6 border-t border-negativo-borde pt-6">
          <h3 className="mb-2 text-sm font-medium text-negativo">Zona peligrosa</h3>

          {negocio.es_prueba === true && (
            <div className="mb-4">
              <p className="mb-3 text-xs text-texto-3">
                Esta es una cuenta de prueba. Podés borrar su historial transaccional para seguir
                probando sin arrastrar datos viejos.
              </p>
              <button
                onClick={() => setMostrarResetearPrueba(true)}
                className="rounded-md border border-negativo px-3 py-2 text-sm font-medium text-negativo hover:bg-negativo-fondo"
              >
                Resetear datos de prueba
              </button>
            </div>
          )}

          <div className={negocio.es_prueba === true ? 'border-t border-negativo-borde pt-4' : ''}>
            <p className="mb-3 text-xs text-texto-3">
              Elimina el negocio por completo: datos y usuarios, para siempre. No se puede
              deshacer. Distinto del reset de datos de prueba, que conserva productos y usuarios.
            </p>
            <Button variante="destructivo" compacto onClick={() => setMostrarEliminar(true)}>
              Eliminar cuenta
            </Button>
          </div>
        </section>

        {mostrarResetearPrueba && (
          <ResetearDatosPruebaModal
            negocioId={negocio.id}
            negocioNombre={negocio.nombre}
            onCerrar={() => setMostrarResetearPrueba(false)}
            onListo={() => {
              setAviso(
                `Datos de prueba reseteados: se borraron ventas, presupuestos, movimientos de stock, cierres y fiado. Los productos y usuarios de ${negocio.nombre} no se tocaron.`,
              );
              onActualizado();
            }}
          />
        )}

        {mostrarEliminar && (
          <EliminarNegocioModal
            negocioId={negocio.id}
            negocioNombre={negocio.nombre}
            solicitudEliminacionEn={negocio.solicitud_eliminacion_en}
            onCerrar={() => setMostrarEliminar(false)}
            onEliminado={(resultado) => {
              setMostrarEliminar(false);
              onEliminado(resultado);
            }}
          />
        )}

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
