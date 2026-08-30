import { supabase } from './supabase';
import type { AuditoriaEntry } from './types';

export async function listarAuditoriaReciente(limite = 50): Promise<AuditoriaEntry[]> {
  const { data, error } = await supabase.rpc('panel_auditoria_reciente', {
    p_limite: limite,
  });
  if (error) throw error;
  return (data ?? []) as AuditoriaEntry[];
}
