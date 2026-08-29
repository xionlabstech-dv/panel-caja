import { supabase } from './supabase';
import type { Estado, Negocio } from './types';

export async function listarNegocios(): Promise<Negocio[]> {
  const { data, error } = await supabase.rpc('panel_listar_negocios');
  if (error) throw error;
  return (data ?? []) as Negocio[];
}

export async function crearNegocio(nombre: string): Promise<string> {
  const { data, error } = await supabase.rpc('panel_crear_negocio', { p_nombre: nombre });
  if (error) throw error;
  return data as string;
}

export async function cambiarEstado(negocioId: string, estado: Estado, nota: string) {
  const { error } = await supabase.rpc('panel_cambiar_estado', {
    p_negocio_id: negocioId,
    p_estado: estado,
    p_nota: nota,
  });
  if (error) throw error;
}

export async function actualizarFechaPago(negocioId: string, fecha: string) {
  const { error } = await supabase.rpc('panel_actualizar_fecha_pago', {
    p_negocio_id: negocioId,
    p_fecha: fecha,
  });
  if (error) throw error;
}
