'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import NavBar from '@/components/NavBar';
import EstadoBadge from '@/components/EstadoBadge';
import NegocioDetalle from '@/components/NegocioDetalle';
import { listarNegocios } from '@/lib/negocios';
import { diasHasta, formatearFecha } from '@/lib/fechas';
import type { Negocio } from '@/lib/types';

function urgenciaPago(negocio: Negocio): 0 | 1 | 2 {
  const dias = diasHasta(negocio.fecha_proximo_pago);
  if (dias === null) return 0;
  if (dias < 0) return 2;
  if (dias <= 5) return 1;
  return 0;
}

function AvisoPago({ negocio }: { negocio: Negocio }) {
  const dias = diasHasta(negocio.fecha_proximo_pago);
  if (dias === null) {
    return <span className="text-sm text-slate-400">Sin fecha</span>;
  }
  if (dias < 0) {
    return (
      <span className="text-sm font-medium text-red-600">
        {formatearFecha(negocio.fecha_proximo_pago)} · vencido hace {Math.abs(dias)} día
        {Math.abs(dias) === 1 ? '' : 's'}
      </span>
    );
  }
  if (dias <= 5) {
    return (
      <span className="text-sm font-medium text-amber-600">
        {formatearFecha(negocio.fecha_proximo_pago)} · en {dias} día{dias === 1 ? '' : 's'}
      </span>
    );
  }
  return <span className="text-sm text-slate-600">{formatearFecha(negocio.fecha_proximo_pago)}</span>;
}

function ListaNegocios() {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<Negocio | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const data = await listarNegocios();
      setNegocios(data);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron cargar los negocios');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ordenados = useMemo(() => {
    return [...negocios].sort((a, b) => {
      const urgA = urgenciaPago(a);
      const urgB = urgenciaPago(b);
      if (urgA !== urgB) return urgB - urgA;
      return a.nombre.localeCompare(b.nombre);
    });
  }, [negocios]);

  useEffect(() => {
    if (!seleccionado) return;
    const actualizado = negocios.find((n) => n.id === seleccionado.id);
    if (actualizado) setSeleccionado(actualizado);
  }, [negocios, seleccionado]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Negocios</h1>
        <button
          onClick={cargar}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : ordenados.length === 0 ? (
        <p className="text-sm text-slate-500">Todavía no hay negocios registrados.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Negocio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Próximo pago</th>
                <th className="px-4 py-3 font-medium">Usuarios</th>
                <th className="px-4 py-3 font-medium">Nota interna</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordenados.map((negocio) => (
                <tr key={negocio.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{negocio.nombre}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={negocio.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <AvisoPago negocio={negocio} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">{negocio.cantidad_usuarios}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">
                    {negocio.estado_nota || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSeleccionado(negocio)}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Administrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {seleccionado && (
        <NegocioDetalle
          negocio={seleccionado}
          onCerrar={() => setSeleccionado(null)}
          onActualizado={cargar}
        />
      )}
    </div>
  );
}

export default function NegociosPage() {
  return (
    <RequireAuth>
      {(cuenta) => (
        <div>
          <NavBar nombre={cuenta.nombre} />
          <ListaNegocios />
        </div>
      )}
    </RequireAuth>
  );
}
