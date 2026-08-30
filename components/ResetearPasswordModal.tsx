'use client';

import { useState } from 'react';
import { resetearPassword } from '@/lib/usuarios';
import type { UsuarioNegocio } from '@/lib/types';

interface Props {
  usuario: UsuarioNegocio;
  negocioNombre: string;
  onCerrar: () => void;
  onListo: () => void;
}

type Paso = 'form' | 'confirmar' | 'resultado';

export default function ResetearPasswordModal({ usuario, negocioNombre, onCerrar, onListo }: Props) {
  const [paso, setPaso] = useState<Paso>('form');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function confirmarReseteo() {
    setError(null);
    setCargando(true);
    try {
      await resetearPassword(usuario.usuario_id, password);
      setPaso('resultado');
      onListo();
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo resetear la contraseña');
    } finally {
      setCargando(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(password);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Si el navegador no permite copiar, el bloque de texto sigue visible para copiar a mano.
    }
  }

  function cerrarYLimpiar() {
    setPassword('');
    onCerrar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {paso === 'form' && (
          <>
            <h2 className="mb-1 text-base font-semibold text-slate-900">Resetear contraseña</h2>
            <p className="mb-4 text-sm text-slate-600">
              Usuario <span className="font-medium text-slate-800">{usuario.usuario}</span> en{' '}
              <span className="font-medium text-slate-800">{negocioNombre}</span>
            </p>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña nueva</label>
            <div className="flex gap-2">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword((v) => !v)}
                className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Mínimo 8 caracteres. Se muestra en texto plano para poder dictarla por teléfono.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cerrarYLimpiar}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => setPaso('confirmar')}
                disabled={password.length < 8}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {paso === 'confirmar' && (
          <>
            <h2 className="mb-2 text-base font-semibold text-slate-900">
              ¿Resetear la contraseña de {usuario.usuario}?
            </h2>
            <p className="mb-6 text-sm text-slate-600">
              Se le asignará una contraseña nueva al usuario <strong>{usuario.usuario}</strong> del
              negocio <strong>{negocioNombre}</strong>. No hace falta la contraseña actual. Si tiene
              una sesión abierta en Caja, sigue funcionando: la contraseña nueva aplica recién en el
              próximo inicio de sesión.
            </p>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPaso('form')}
                disabled={cargando}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Volver
              </button>
              <button
                onClick={confirmarReseteo}
                disabled={cargando}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cargando ? 'Reseteando...' : 'Resetear contraseña'}
              </button>
            </div>
          </>
        )}

        {paso === 'resultado' && (
          <>
            <h2 className="mb-1 text-base font-semibold text-slate-900">Contraseña actualizada</h2>
            <p className="mb-4 text-sm text-slate-600">
              Nueva contraseña de <strong>{usuario.usuario}</strong>:
            </p>
            <div className="mb-2 flex items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 py-2">
              <code className="flex-1 select-all break-all text-sm text-slate-900">{password}</code>
              <button
                onClick={copiar}
                className="shrink-0 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="mb-6 text-xs text-amber-700">
              No queda guardada en ningún lado. Copiala o dictala ahora — después de cerrar esta
              ventana no se va a poder volver a ver.
            </p>
            <div className="flex justify-end">
              <button
                onClick={cerrarYLimpiar}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
