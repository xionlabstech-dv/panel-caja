'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { verificarSuperadmin, cerrarSesion } from '@/lib/auth';
import type { MiCuenta } from '@/lib/types';

interface Props {
  children: (cuenta: MiCuenta) => React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const router = useRouter();
  const [cuenta, setCuenta] = useState<MiCuenta | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    async function verificar() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (activo) router.replace('/login');
        return;
      }
      const miCuenta = await verificarSuperadmin();
      if (!activo) return;
      if (!miCuenta) {
        await cerrarSesion();
        router.replace('/login?no_autorizado=1');
        return;
      }
      setCuenta(miCuenta);
      setCargando(false);
    }

    verificar();

    return () => {
      activo = false;
    };
  }, [router]);

  if (cargando || !cuenta) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Verificando sesión...
      </div>
    );
  }

  return <>{children(cuenta)}</>;
}
