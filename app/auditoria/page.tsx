'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import NavBar from '@/components/NavBar';
import { listarAuditoriaReciente } from '@/lib/auditoria';
import { formatearFechaHora } from '@/lib/fechas';
import type { AuditoriaEntry } from '@/lib/types';

function Auditoria() {
  const [entradas, setEntradas] = useState<AuditoriaEntry[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarAuditoriaReciente()
      .then(setEntradas)
      .catch((err) => setError(err?.message ?? 'No se pudo cargar la auditoría'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Auditoría</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : entradas.length === 0 ? (
        <p className="text-sm text-slate-500">Todavía no hay acciones registradas.</p>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {entradas.map((entrada, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{entrada.accion}</span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatearFechaHora(entrada.ocurrido_en)}
                  </span>
                </div>
                <div className="text-sm text-slate-700">{entrada.negocio_nombre}</div>
                <div className="text-sm text-slate-700">{entrada.usuario_afectado}</div>
                {entrada.detalle && (
                  <div className="mt-1 text-sm text-slate-500">{entrada.detalle}</div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha y hora</th>
                  <th className="px-4 py-3 font-medium">Acción</th>
                  <th className="px-4 py-3 font-medium">Negocio</th>
                  <th className="px-4 py-3 font-medium">Usuario afectado</th>
                  <th className="px-4 py-3 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entradas.map((entrada, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatearFechaHora(entrada.ocurrido_en)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{entrada.accion}</td>
                    <td className="px-4 py-3 text-slate-700">{entrada.negocio_nombre}</td>
                    <td className="px-4 py-3 text-slate-700">{entrada.usuario_afectado}</td>
                    <td className="px-4 py-3 text-slate-500">{entrada.detalle || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function AuditoriaPage() {
  return (
    <RequireAuth>
      {(cuenta) => (
        <div>
          <NavBar nombre={cuenta.nombre} />
          <Auditoria />
        </div>
      )}
    </RequireAuth>
  );
}
