'use client';

import { useState } from 'react';
import { cambiarUsuarioCliente } from '@/lib/usuarios';
import type { UsuarioNegocio } from '@/lib/types';

interface Props {
  usuario: UsuarioNegocio;
  negocioNombre: string;
  onCerrar: () => void;
  onListo: () => void;
}

export default function CambiarUsuarioClienteModal({
  usuario,
  negocioNombre,
  onCerrar,
  onListo,
}: Props) {
  const [usuarioNuevo, setUsuarioNuevo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await cambiarUsuarioCliente(usuario.usuario_id, usuarioNuevo);
      onListo();
      onCerrar();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo cambiar el usuario');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-slate-900">Cambiar usuario</h2>
        <p className="mb-4 text-sm text-slate-600">
          Usuario actual <span className="font-medium text-slate-800">{usuario.usuario}</span> en{' '}
          <span className="font-medium text-slate-800">{negocioNombre}</span>
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <label className="mb-1 block text-sm font-medium text-slate-700">Usuario nuevo</label>
        <input
          type="text"
          value={usuarioNuevo}
          onChange={(e) => setUsuarioNuevo(e.target.value)}
          required
          autoFocus
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">
          Mínimo 3 caracteres. Solo letras, números, guiones, puntos y guión bajo. Tiene que ser
          único en todo el sistema.
        </p>

        <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          El usuario nuevo es el que va a servir para entrar a partir de ahora. Si el cliente tiene
          la sesión abierta en Caja, no se le cierra.
        </div>

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
            disabled={cargando}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {cargando ? 'Guardando...' : 'Cambiar usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}
