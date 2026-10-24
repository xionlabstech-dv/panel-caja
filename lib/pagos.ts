import { supabase } from './supabase';
import type { LineaPagoGrupo, Moneda, PagoLicencia } from './types';

export interface NuevoPago {
  monto: number;
  moneda: Moneda;
  tasa?: number | null;
  fechaPago?: string | null;
  periodoDesde?: string | null;
  periodoHasta?: string | null;
  metodo?: string | null;
  referencia?: string | null;
  nota?: string | null;
}

export async function registrarPago(negocioId: string, pago: NuevoPago): Promise<string> {
  const { data, error } = await supabase.rpc('panel_registrar_pago', {
    p_negocio_id: negocioId,
    p_monto: pago.monto,
    p_moneda: pago.moneda,
    p_tasa: pago.tasa ?? null,
    p_fecha_pago: pago.fechaPago ?? null,
    p_periodo_desde: pago.periodoDesde ?? null,
    p_periodo_hasta: pago.periodoHasta ?? null,
    p_metodo: pago.metodo ?? null,
    p_referencia: pago.referencia ?? null,
    p_nota: pago.nota ?? null,
  });
  if (error) throw error;
  return data as string;
}

export interface NuevoPagoGrupo {
  lineas: LineaPagoGrupo[];
  moneda: Moneda;
  tasa?: number | null;
  fechaPago?: string | null;
  metodo?: string | null;
  referencia?: string | null;
  nota?: string | null;
}

export async function registrarPagoGrupo(pago: NuevoPagoGrupo): Promise<string> {
  const { data, error } = await supabase.rpc('panel_registrar_pago_grupo', {
    // Los períodos van en null a propósito: la base los resuelve por negocio,
    // cada uno desde su propia fecha de vencimiento.
    p_lineas: pago.lineas.map((l) => ({ negocio_id: l.negocioId, monto: l.monto, periodo_desde: null, periodo_hasta: null })),
    p_moneda: pago.moneda,
    p_tasa: pago.tasa ?? null,
    p_fecha_pago: pago.fechaPago ?? null,
    p_metodo: pago.metodo ?? null,
    p_referencia: pago.referencia ?? null,
    p_nota: pago.nota ?? null,
  });
  if (error) throw error;
  return data as string;
}

export async function listarPagos(negocioId?: string): Promise<PagoLicencia[]> {
  const { data, error } = await supabase.rpc('panel_listar_pagos', {
    p_negocio_id: negocioId ?? null,
  });
  if (error) throw error;
  return (data ?? []) as PagoLicencia[];
}

export async function eliminarPago(pagoId: string): Promise<void> {
  const { error } = await supabase.rpc('panel_eliminar_pago', { p_pago_id: pagoId });
  if (error) throw error;
}
