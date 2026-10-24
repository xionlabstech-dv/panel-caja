'use client';

import { useCallback, useEffect, useState } from 'react';
import { registrarPago, listarPagos, eliminarPago } from '@/lib/pagos';
import { formatearFecha } from '@/lib/fechas';
import type { Moneda, PagoLicencia } from '@/lib/types';
import ConfirmModal from './ConfirmModal';
import Button from './ui/Button';
import Input from './ui/Input';

interface Props {
  negocioId: string;
  precioMensual: number | null;
  fechaProximoPago: string | null;
  onPagoRegistrado: () => void;
}

function hoyISO(): string {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd = String(hoy.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function sumarUnMes(fechaISO: string): string {
  const fecha = new Date(fechaISO + 'T00:00:00');
  fecha.setMonth(fecha.getMonth() + 1);
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatearMonto(valor: number): string {
  return valor.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PagosSeccion({
  negocioId,
  precioMensual,
  fechaProximoPago,
  onPagoRegistrado,
}: Props) {
  const [pagos, setPagos] = useState<PagoLicencia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('USD');
  const [tasa, setTasa] = useState('');
  const [fechaPago, setFechaPago] = useState('');
  const [periodoDesde, setPeriodoDesde] = useState('');
  const [periodoHasta, setPeriodoHasta] = useState('');
  const [metodo, setMetodo] = useState('');
  const [referencia, setReferencia] = useState('');
  const [nota, setNota] = useState('');

  const [pagoAEliminar, setPagoAEliminar] = useState<PagoLicencia | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const data = await listarPagos(negocioId);
      setPagos(data);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron cargar los pagos');
    } finally {
      setCargando(false);
    }
  }, [negocioId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function abrirFormulario() {
    const desde = fechaProximoPago ?? hoyISO();
    setMonto(precioMensual != null ? String(precioMensual) : '');
    setMoneda('USD');
    setTasa('');
    setFechaPago(hoyISO());
    setPeriodoDesde(desde);
    setPeriodoHasta(sumarUnMes(desde));
    setMetodo('');
    setReferencia('');
    setNota('');
    setFormError(null);
    setMostrarFormulario(true);
  }

  async function onSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setError(null);

    const montoNum = Number(monto);
    if (monto.trim() === '' || Number.isNaN(montoNum) || montoNum < 0) {
      setFormError('El monto debe ser un número mayor o igual a 0.');
      return;
    }

    let tasaNum: number | null = null;
    if (moneda === 'Bs') {
      tasaNum = Number(tasa);
      if (tasa.trim() === '' || Number.isNaN(tasaNum) || tasaNum <= 0) {
        setFormError('Un pago en bolívares necesita la tasa del día.');
        return;
      }
    }

    const desde = periodoDesde.trim() === '' ? null : periodoDesde;
    const hasta = periodoHasta.trim() === '' ? null : periodoHasta;
    if (desde && hasta && hasta <= desde) {
      setFormError('El período hasta debe ser posterior al período desde.');
      return;
    }

    setGuardando(true);
    try {
      await registrarPago(negocioId, {
        monto: montoNum,
        moneda,
        tasa: tasaNum,
        fechaPago: fechaPago.trim() === '' ? null : fechaPago,
        periodoDesde: desde,
        periodoHasta: hasta,
        metodo: metodo.trim() === '' ? null : metodo.trim(),
        referencia: referencia.trim() === '' ? null : referencia.trim(),
        nota: nota.trim() === '' ? null : nota.trim(),
      });
      setAviso('Pago registrado.');
      setMostrarFormulario(false);
      await cargar();
      onPagoRegistrado();
    } catch (err: any) {
      setFormError(err?.message ?? 'No se pudo registrar el pago');
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminar() {
    if (!pagoAEliminar) return;
    setError(null);
    setEliminando(true);
    try {
      await eliminarPago(pagoAEliminar.id);
      setAviso('Pago eliminado.');
      setPagoAEliminar(null);
      await cargar();
      onPagoRegistrado();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo eliminar el pago');
    } finally {
      setEliminando(false);
    }
  }

  const mostrarEquivalente =
    moneda === 'Bs' &&
    tasa.trim() !== '' &&
    monto.trim() !== '' &&
    !Number.isNaN(Number(tasa)) &&
    Number(tasa) > 0 &&
    !Number.isNaN(Number(monto));

  return (
    <section className="border-t border-borde-divisor pt-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-texto-2">Pagos</h3>
        {!mostrarFormulario && (
          <button
            onClick={abrirFormulario}
            className="text-xs font-medium text-texto-3 hover:text-texto"
          >
            Registrar pago
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
      )}
      {aviso && (
        <div className="mb-3 rounded-md bg-marca-suave px-3 py-2 text-sm text-marca-suave-texto">
          {aviso}
        </div>
      )}

      {mostrarFormulario && (
        <form onSubmit={onSubmitForm} className="mb-4 space-y-4 rounded-md border border-borde-campo p-3">
          {formError && (
            <div className="rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{formError}</div>
          )}

          <div>
            <Input
              label="Monto"
              type="number"
              step="0.01"
              min={0}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
            {mostrarEquivalente && (
              <p className="mt-1 text-xs text-texto-4">
                ≈ ${formatearMonto(Number(monto) / Number(tasa))}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-texto-2">Moneda</label>
            <div className="flex gap-2">
              {(['USD', 'Bs'] as Moneda[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    if (m === moneda) return;
                    setMoneda(m);
                    // El monto es específico de la moneda: lo que servía para USD nunca
                    // sirve para Bs ni al revés. Dejarlo era registrar 10 Bs en vez de
                    // 8.863, o $8.863 en vez de $10.
                    setMonto('');
                  }}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                    moneda === m
                      ? 'border-marca bg-marca text-texto-invertido'
                      : 'border-borde-campo text-texto-2 hover:bg-tarjeta-hundida'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {moneda === 'Bs' && (
            <Input
              label="Tasa (Bs por USD)"
              type="number"
              step="0.01"
              min={0}
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              required
            />
          )}

          <Input
            label="Fecha de pago"
            type="date"
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Período desde"
              type="date"
              value={periodoDesde}
              onChange={(e) => setPeriodoDesde(e.target.value)}
            />
            <Input
              label="Período hasta"
              type="date"
              value={periodoHasta}
              onChange={(e) => setPeriodoHasta(e.target.value)}
            />
          </div>

          <Input
            label="Método"
            type="text"
            value={metodo}
            onChange={(e) => setMetodo(e.target.value)}
            placeholder="Pago Móvil, efectivo, USDT..."
          />
          <Input
            label="Referencia"
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
          <Input
            label="Nota"
            type="text"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variante="secundario"
              compacto
              onClick={() => setMostrarFormulario(false)}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button type="submit" variante="primario" compacto disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      )}

      {cargando ? (
        <p className="text-sm text-texto-3">Cargando...</p>
      ) : pagos.length === 0 ? (
        <p className="text-sm text-texto-3">Todavía no hay pagos registrados.</p>
      ) : (
        <ul className="divide-y divide-borde-divisor rounded-md border border-borde-campo">
          {pagos.map((pago) => (
            <li
              key={pago.id}
              className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-texto">
                    {pago.moneda === 'USD' ? '$' : 'Bs'} {formatearMonto(pago.monto)}
                  </span>
                  {pago.moneda === 'Bs' && pago.monto_usd != null && (
                    <span className="text-xs text-texto-3">
                      (≈ ${formatearMonto(pago.monto_usd)})
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-texto-3">
                  Período {formatearFecha(pago.periodo_desde)} – {formatearFecha(pago.periodo_hasta)} ·
                  Pagado {formatearFecha(pago.fecha_pago)}
                </p>
                {(pago.metodo || pago.referencia) && (
                  <p className="truncate text-xs text-texto-4">
                    {[pago.metodo, pago.referencia].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => setPagoAEliminar(pago)}
                  className="text-xs font-medium text-texto-3 hover:text-texto"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pagoAEliminar && (
        <ConfirmModal
          titulo="¿Eliminar este pago?"
          mensaje={`Se va a borrar el pago de ${pagoAEliminar.moneda === 'USD' ? '$' : 'Bs'} ${formatearMonto(
            pagoAEliminar.monto,
          )} del ${formatearFecha(pagoAEliminar.fecha_pago)}. La fecha de próximo pago del negocio puede recalcularse.`}
          confirmarTexto="Eliminar"
          cargando={eliminando}
          onCancelar={() => setPagoAEliminar(null)}
          onConfirmar={confirmarEliminar}
        />
      )}
    </section>
  );
}
