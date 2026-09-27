'use client';

import { useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import NavBar from '@/components/NavBar';
import { crearNegocioConAdmin } from '@/lib/edgeFunctions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
      <h1 className="mb-6 text-xl font-semibold text-texto">Crear negocio</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-borde-campo bg-tarjeta p-6">
        {error && (
          <div className="rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
        )}
        {exito && (
          <div className="rounded-md bg-marca-suave px-3 py-2 text-sm text-marca-suave-texto">{exito}</div>
        )}

        <Input
          label="Nombre del negocio"
          type="text"
          value={nombreNegocio}
          onChange={(e) => setNombreNegocio(e.target.value)}
          required
        />

        <div className="border-t border-borde-divisor pt-4">
          <p className="mb-3 text-sm font-medium text-texto-2">Primer usuario admin</p>
          <div className="space-y-4">
            <div>
              <Input
                label="Usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                placeholder="ej: mayga1"
              />
              <p className="mt-1 text-xs text-texto-4">
                Mínimo 3 caracteres. Solo letras, números, guiones, puntos y guión bajo.
              </p>
            </div>
            <div>
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="mt-1 text-xs text-texto-4">Mínimo 8 caracteres.</p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={cargando} className="w-full">
          {cargando ? 'Creando...' : 'Crear negocio'}
        </Button>
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
