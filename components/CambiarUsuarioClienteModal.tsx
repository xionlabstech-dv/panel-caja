'use client';

import { useState } from 'react';
import { cambiarUsuarioCliente } from '@/lib/usuarios';
import type { UsuarioNegocio } from '@/lib/types';
import Button from './ui/Button';
import Input from './ui/Input';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg bg-tarjeta p-6 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-texto">Cambiar usuario</h2>
        <p className="mb-4 text-sm text-texto-3">
          Usuario actual <span className="font-medium text-texto-2">{usuario.usuario}</span> en{' '}
          <span className="font-medium text-texto-2">{negocioNombre}</span>
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
        )}

        <Input
          label="Usuario nuevo"
          type="text"
          value={usuarioNuevo}
          onChange={(e) => setUsuarioNuevo(e.target.value)}
          required
          autoFocus
        />
        <p className="mt-1 text-xs text-texto-4">
          Mínimo 3 caracteres. Solo letras, números, guiones, puntos y guión bajo. Tiene que ser
          único en todo el sistema.
        </p>

        <div className="mt-3 rounded-md bg-aviso-fondo px-3 py-2 text-xs text-aviso">
          El usuario nuevo es el que va a servir para entrar a partir de ahora. Si el cliente tiene
          la sesión abierta en Caja, no se le cierra.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variante="secundario" compacto onClick={onCerrar} disabled={cargando}>
            Cancelar
          </Button>
          <Button type="submit" variante="primario" compacto disabled={cargando}>
            {cargando ? 'Guardando...' : 'Cambiar usuario'}
          </Button>
        </div>
      </form>
    </div>
  );
}
