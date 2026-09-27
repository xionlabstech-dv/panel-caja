'use client';

import { useState } from 'react';
import { resetearPassword } from '@/lib/usuarios';
import type { UsuarioNegocio } from '@/lib/types';
import Button from './ui/Button';
import Input from './ui/Input';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4">
      <div className="w-full max-w-sm rounded-lg bg-tarjeta p-6 shadow-lg">
        {paso === 'form' && (
          <>
            <h2 className="mb-1 text-base font-semibold text-texto">Resetear contraseña</h2>
            <p className="mb-4 text-sm text-texto-3">
              Usuario <span className="font-medium text-texto-2">{usuario.usuario}</span> en{' '}
              <span className="font-medium text-texto-2">{negocioNombre}</span>
            </p>

            {error && (
              <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
            )}

            <label className="mb-1 block text-sm font-medium text-texto-2">Contraseña nueva</label>
            <div className="flex gap-2">
              <Input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button
                type="button"
                variante="secundario"
                compacto
                onClick={() => setMostrarPassword((v) => !v)}
                className="shrink-0 text-xs"
              >
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            <p className="mt-1 text-xs text-texto-4">
              Mínimo 8 caracteres. Se muestra en texto plano para poder dictarla por teléfono.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button variante="secundario" compacto onClick={cerrarYLimpiar}>
                Cancelar
              </Button>
              <Button
                variante="primario"
                compacto
                onClick={() => setPaso('confirmar')}
                disabled={password.length < 8}
              >
                Continuar
              </Button>
            </div>
          </>
        )}

        {paso === 'confirmar' && (
          <>
            <h2 className="mb-2 text-base font-semibold text-texto">
              ¿Resetear la contraseña de {usuario.usuario}?
            </h2>
            <p className="mb-6 text-sm text-texto-3">
              Se le asignará una contraseña nueva al usuario <strong>{usuario.usuario}</strong> del
              negocio <strong>{negocioNombre}</strong>. No hace falta la contraseña actual. Si tiene
              una sesión abierta en Caja, sigue funcionando: la contraseña nueva aplica recién en el
              próximo inicio de sesión.
            </p>

            {error && (
              <div className="mb-4 rounded-md bg-negativo-fondo px-3 py-2 text-sm text-negativo">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <Button variante="secundario" compacto onClick={() => setPaso('form')} disabled={cargando}>
                Volver
              </Button>
              <Button variante="destructivo" compacto onClick={confirmarReseteo} disabled={cargando}>
                {cargando ? 'Reseteando...' : 'Resetear contraseña'}
              </Button>
            </div>
          </>
        )}

        {paso === 'resultado' && (
          <>
            <h2 className="mb-1 text-base font-semibold text-texto">Contraseña actualizada</h2>
            <p className="mb-4 text-sm text-texto-3">
              Nueva contraseña de <strong>{usuario.usuario}</strong>:
            </p>
            <div className="mb-2 flex items-center gap-2 rounded-md border border-borde-campo bg-tarjeta-hundida px-3 py-2">
              <code className="flex-1 select-all break-all text-sm text-texto">{password}</code>
              <button
                onClick={copiar}
                className="shrink-0 rounded-md border border-borde-campo bg-tarjeta px-2 py-1 text-xs text-texto-3 hover:bg-tarjeta-hundida"
              >
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="mb-6 text-xs text-aviso">
              No queda guardada en ningún lado. Copiala o dictala ahora — después de cerrar esta
              ventana no se va a poder volver a ver.
            </p>
            <div className="flex justify-end">
              <Button variante="primario" compacto onClick={cerrarYLimpiar}>
                Cerrar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
