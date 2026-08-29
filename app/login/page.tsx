'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { iniciarSesion, verificarSuperadmin, cerrarSesion } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const noAutorizado = params.get('no_autorizado') === '1';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(usuario, password);
      const cuenta = await verificarSuperadmin();
      if (!cuenta) {
        await cerrarSesion();
        setError('No autorizado: este usuario no tiene acceso al panel.');
        setCargando(false);
        return;
      }
      router.replace('/negocios');
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo iniciar sesión');
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">Panel Caja</h1>
        <p className="mb-6 text-sm text-slate-500">Iniciá sesión para administrar comercios.</p>

        {noAutorizado && (
          <div className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            No autorizado: ese usuario no tiene acceso al panel.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoFocus
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
