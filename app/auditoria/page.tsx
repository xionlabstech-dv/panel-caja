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
      <h1 className="mb-6 text-xl font-semibold text-texto">Auditoría</h1>

      {error && (
        <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
      )}

      {cargando ? (
        <p className="text-sm text-texto-3">Cargando...</p>
      ) : entradas.length === 0 ? (
        <p className="text-sm text-texto-3">Todavía no hay acciones registradas.</p>
      ) : (
        <>
          <div className="space-y-3 sm:hidden">
            {entradas.map((entrada, i) => (
              <div key={i} className="rounded-lg border border-borde-campo bg-tarjeta p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="font-medium text-texto">{entrada.accion}</span>
                  <span className="shrink-0 text-xs text-texto-4">
                    {formatearFechaHora(entrada.ocurrido_en)}
                  </span>
                </div>
                <div className="text-sm text-texto-2">{entrada.negocio_nombre}</div>
                <div className="text-sm text-texto-2">{entrada.usuario_afectado}</div>
                {entrada.detalle && (
                  <div className="mt-1 text-sm text-texto-3">{entrada.detalle}</div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-borde-campo bg-tarjeta sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-borde-divisor bg-tarjeta-hundida text-xs uppercase text-texto-3">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha y hora</th>
                  <th className="px-4 py-3 font-medium">Acción</th>
                  <th className="px-4 py-3 font-medium">Negocio</th>
                  <th className="px-4 py-3 font-medium">Usuario afectado</th>
                  <th className="px-4 py-3 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde-divisor">
                {entradas.map((entrada, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-4 py-3 text-texto-3">
                      {formatearFechaHora(entrada.ocurrido_en)}
                    </td>
                    <td className="px-4 py-3 font-medium text-texto">{entrada.accion}</td>
                    <td className="px-4 py-3 text-texto-2">{entrada.negocio_nombre}</td>
                    <td className="px-4 py-3 text-texto-2">{entrada.usuario_afectado}</td>
                    <td className="px-4 py-3 text-texto-3">{entrada.detalle || '—'}</td>
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
