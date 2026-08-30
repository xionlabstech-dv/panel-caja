import { supabase } from './supabase';
import type { UsuarioNegocio } from './types';

export async function listarUsuarios(negocioId: string): Promise<UsuarioNegocio[]> {
  const { data, error } = await supabase.rpc('panel_listar_usuarios', {
    p_negocio_id: negocioId,
  });
  if (error) throw error;
  return (data ?? []) as UsuarioNegocio[];
}

export async function resetearPassword(usuarioId: string, passwordNueva: string) {
  const { error } = await supabase.rpc('panel_resetear_password', {
    p_usuario_id: usuarioId,
    p_password_nueva: passwordNueva,
  });
  if (error) throw error;
}

export async function cambiarUsuarioCliente(usuarioId: string, usuarioNuevo: string) {
  const { error } = await supabase.rpc('panel_cambiar_usuario_cliente', {
    p_usuario_id: usuarioId,
    p_usuario_nuevo: usuarioNuevo,
  });
  if (error) throw error;
}
