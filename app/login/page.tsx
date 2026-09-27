'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { iniciarSesion, verificarSuperadmin, cerrarSesion } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
    <div className="flex min-h-screen items-center justify-center bg-superficie px-4">
      <div className="w-full max-w-sm rounded-lg border border-borde-campo bg-tarjeta p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-texto">Panel Caja</h1>
        <p className="mb-6 text-sm text-texto-3">Iniciá sesión para administrar comercios.</p>

        {noAutorizado && (
          <div className="mb-4 rounded-md bg-aviso-fondo px-3 py-2 text-sm text-aviso">
            No autorizado: ese usuario no tiene acceso al panel.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={cargando} className="w-full">
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </Button>
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
