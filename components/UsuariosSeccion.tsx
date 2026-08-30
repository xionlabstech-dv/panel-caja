'use client';

import { useCallback, useEffect, useState } from 'react';
import { listarUsuarios } from '@/lib/usuarios';
import type { UsuarioNegocio } from '@/lib/types';
import ResetearPasswordModal from './ResetearPasswordModal';
import CambiarUsuarioClienteModal from './CambiarUsuarioClienteModal';

interface Props {
  negocioId: string;
  negocioNombre: string;
}

export default function UsuariosSeccion({ negocioId, negocioNombre }: Props) {
  const [usuarios, setUsuarios] = useState<UsuarioNegocio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetear, setResetear] = useState<UsuarioNegocio | null>(null);
  const [cambiarUsuario, setCambiarUsuario] = useState<UsuarioNegocio | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const data = await listarUsuarios(negocioId);
      setUsuarios(data);
    } catch (err: any) {
      setError(err?.message ?? 'No se pudieron cargar los usuarios');
    } finally {
      setCargando(false);
    }
  }, [negocioId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <section className="border-t border-slate-200 pt-6">
      <h3 className="mb-2 text-sm font-medium text-slate-700">Usuarios</h3>

      {error && (
        <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      {aviso && (
        <div className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {aviso}
        </div>
      )}

      {cargando ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-sm text-slate-500">Este negocio todavía no tiene usuarios.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
          {usuarios.map((usuario) => (
            <li key={usuario.usuario_id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-slate-900">{usuario.usuario}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {usuario.rol === 'admin' ? 'Admin' : 'Cajero'}
                  </span>
                  {!usuario.activo && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                      Inactivo
                    </span>
                  )}
                </div>
                {usuario.nombre && <p className="truncate text-xs text-slate-500">{usuario.nombre}</p>}
              </div>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={() => setCambiarUsuario(usuario)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cambiar usuario
                </button>
                <button
                  onClick={() => setResetear(usuario)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Resetear contraseña
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {resetear && (
        <ResetearPasswordModal
          usuario={resetear}
          negocioNombre={negocioNombre}
          onCerrar={() => setResetear(null)}
          onListo={() => {
            setAviso(`Contraseña de ${resetear.usuario} reseteada.`);
            cargar();
          }}
        />
      )}

      {cambiarUsuario && (
        <CambiarUsuarioClienteModal
          usuario={cambiarUsuario}
          negocioNombre={negocioNombre}
          onCerrar={() => setCambiarUsuario(null)}
          onListo={() => {
            setAviso(`Usuario actualizado correctamente.`);
            cargar();
          }}
        />
      )}
    </section>
  );
}
