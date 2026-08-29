'use client';

import { useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import NavBar from '@/components/NavBar';
import { supabase } from '@/lib/supabase';
import type { MiCuenta } from '@/lib/types';

function CambiarUsuario({ cuenta, onCambiado }: { cuenta: MiCuenta; onCambiado: (nuevo: string) => void }) {
  const [usuarioNuevo, setUsuarioNuevo] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(null);
    setCargando(true);
    try {
      const { error } = await supabase.rpc('panel_cambiar_usuario', {
        p_usuario_nuevo: usuarioNuevo,
        p_password_actual: passwordActual,
      });
      if (error) throw error;
      setExito(
        `Usuario actualizado a "${usuarioNuevo}". Tu sesión actual sigue activa, pero la próxima vez que inicies sesión usá este nuevo usuario.`,
      );
      onCambiado(usuarioNuevo);
      setUsuarioNuevo('');
      setPasswordActual('');
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo cambiar el usuario');
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Cambiar usuario</h2>
      <p className="text-sm text-slate-500">Usuario actual: <span className="font-medium text-slate-700">{cuenta.usuario}</span></p>

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {exito && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{exito}</div>}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Usuario nuevo</label>
        <input
          type="text"
          value={usuarioNuevo}
          onChange={(e) => setUsuarioNuevo(e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña actual</label>
        <input
          type="password"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {cargando ? 'Guardando...' : 'Cambiar usuario'}
      </button>
    </form>
  );
}

function CambiarPassword() {
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExito(null);
    setCargando(true);
    try {
      const { error } = await supabase.rpc('panel_cambiar_password', {
        p_password_actual: passwordActual,
        p_password_nueva: passwordNueva,
      });
      if (error) throw error;
      setExito('Contraseña actualizada.');
      setPasswordActual('');
      setPasswordNueva('');
    } catch (err: any) {
      setError(err?.message ?? 'No se pudo cambiar la contraseña');
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Cambiar contraseña</h2>

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {exito && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{exito}</div>}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña actual</label>
        <input
          type="password"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña nueva</label>
        <input
          type="password"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-slate-400">Mínimo 8 caracteres.</p>
      </div>
      <button
        type="submit"
        disabled={cargando}
        className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {cargando ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}

export default function CuentaPage() {
  return (
    <RequireAuth>
      {(cuenta) => {
        return <CuentaContenido cuentaInicial={cuenta} />;
      }}
    </RequireAuth>
  );
}

function CuentaContenido({ cuentaInicial }: { cuentaInicial: MiCuenta }) {
  const [cuenta, setCuenta] = useState(cuentaInicial);

  return (
    <div>
      <NavBar nombre={cuenta.nombre} />
      <div className="mx-auto max-w-lg space-y-6 px-6 py-8">
        <h1 className="text-xl font-semibold text-slate-900">Mi cuenta</h1>
        <CambiarUsuario cuenta={cuenta} onCambiado={(usuario) => setCuenta({ ...cuenta, usuario })} />
        <CambiarPassword />
      </div>
    </div>
  );
}
