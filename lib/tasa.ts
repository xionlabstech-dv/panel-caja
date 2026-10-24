import { supabase } from './supabase';
import type { TasaOficial } from './types';

// La RPC es `returns table`, así que PostgREST devuelve un arreglo aunque sea
// una sola fila. Se normaliza acá para que el componente no se entere.
export async function tasaOficial(fecha?: string | null): Promise<TasaOficial | null> {
  const { data, error } = await supabase.rpc('panel_tasa_oficial', {
    p_fecha: fecha ?? null,
  });
  if (error) throw error;
  const fila = Array.isArray(data) ? data[0] : data;
  if (!fila) return null;
  return {
    ...fila,
    tasa: Number(fila.tasa),
  } as TasaOficial;
}
