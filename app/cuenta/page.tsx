'use client';

import { useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import NavBar from '@/components/NavBar';
import { supabase } from '@/lib/supabase';
import type { MiCuenta } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-borde-campo bg-tarjeta p-6">
      <h2 className="text-base font-semibold text-texto">Cambiar usuario</h2>
      <p className="text-sm text-texto-3">Usuario actual: <span className="font-medium text-texto-2">{cuenta.usuario}</span></p>

      {error && <div className="rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>}
      {exito && <div className="rounded-md bg-marca-suave px-3 py-2 text-sm text-marca-suave-texto">{exito}</div>}

      <Input
        label="Usuario nuevo"
        type="text"
        value={usuarioNuevo}
        onChange={(e) => setUsuarioNuevo(e.target.value)}
        required
      />
      <Input
        label="Contraseña actual"
        type="password"
        value={passwordActual}
        onChange={(e) => setPasswordActual(e.target.value)}
        required
      />
      <Button type="submit" disabled={cargando} className="w-full">
        {cargando ? 'Guardando...' : 'Cambiar usuario'}
      </Button>
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
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-borde-campo bg-tarjeta p-6">
      <h2 className="text-base font-semibold text-texto">Cambiar contraseña</h2>

      {error && <div className="rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>}
      {exito && <div className="rounded-md bg-marca-suave px-3 py-2 text-sm text-marca-suave-texto">{exito}</div>}

      <Input
        label="Contraseña actual"
        type="password"
        value={passwordActual}
        onChange={(e) => setPasswordActual(e.target.value)}
        required
      />
      <div>
        <Input
          label="Contraseña nueva"
          type="password"
          value={passwordNueva}
          onChange={(e) => setPasswordNueva(e.target.value)}
          required
          minLength={8}
        />
        <p className="mt-1 text-xs text-texto-4">Mínimo 8 caracteres.</p>
      </div>
      <Button type="submit" disabled={cargando} className="w-full">
        {cargando ? 'Guardando...' : 'Cambiar contraseña'}
      </Button>
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
        <h1 className="text-xl font-semibold text-texto">Mi cuenta</h1>
        <CambiarUsuario cuenta={cuenta} onCambiado={(usuario) => setCuenta({ ...cuenta, usuario })} />
        <CambiarPassword />
      </div>
    </div>
  );
}
