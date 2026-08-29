'use client';

import { useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import NavBar from '@/components/NavBar';
import { crearNegocioConAdmin } from '@/lib/edgeFunctions';

function FormularioCrearNegocio() {
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(null);
    setCargando(true);
    try {
      await crearNegocioConAdmin({ nombreNegocio, usuario, password });
      setExito(`Negocio "${nombreNegocio}" creado con el admin "${usuario}".`);
      setNombreNegocio('');
      setUsuario('');
      setPassword('');
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo crear el negocio');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Crear negocio</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        {exito && (
          <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{exito}</div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nombre del negocio</label>
          <input
            type="text"
            value={nombreNegocio}
            onChange={(e) => setNombreNegocio(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>

        <div className="border-t border-slate-200 pt-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Primer usuario admin</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="ej: mayga1"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                Mínimo 3 caracteres. Solo letras, números, guiones, puntos y guión bajo.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">Mínimo 8 caracteres.</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {cargando ? 'Creando...' : 'Crear negocio'}
        </button>
      </form>
    </div>
  );
}

export default function CrearNegocioPage() {
  return (
    <RequireAuth>
      {(cuenta) => (
        <div>
          <NavBar nombre={cuenta.nombre} />
          <FormularioCrearNegocio />
        </div>
      )}
    </RequireAuth>
  );
}
