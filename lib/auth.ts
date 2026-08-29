import { supabase } from './supabase';
import type { MiCuenta } from './types';

export function usuarioAEmail(usuario: string): string {
  let email = usuario.trim().toLowerCase();
  if (!email.includes('@')) email += '@caja.app';
  return email;
}

export async function iniciarSesion(usuario: string, password: string) {
  const email = usuarioAEmail(usuario);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function obtenerMiCuenta(): Promise<MiCuenta | null> {
  const { data, error } = await supabase.rpc('panel_mi_cuenta');
  if (error) throw error;
  if (!data || data.length === 0) return null;
  return data[0] as MiCuenta;
}

export async function verificarSuperadmin(): Promise<MiCuenta | null> {
  try {
    return await obtenerMiCuenta();
  } catch {
    return null;
  }
}

export async function cerrarSesion() {
  await supabase.auth.signOut();
}
