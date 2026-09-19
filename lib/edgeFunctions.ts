import { supabase } from './supabase';

export interface CrearNegocioInput {
  nombreNegocio: string;
  usuario: string;
  password: string;
}

export async function crearNegocioConAdmin(input: CrearNegocioInput): Promise<{ negocioId: string }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('Sesión no válida, iniciá sesión de nuevo.');

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/panel-crear-negocio`;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre_negocio: input.nombreNegocio,
      usuario: input.usuario,
      password: input.password,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.error) {
    throw new Error(data.error ?? 'No se pudo crear el negocio');
  }

  return { negocioId: data.negocio_id as string };
}

export interface EliminarNegocioResultado {
  usuariosEliminados: number;
  advertencias: string[];
}

export async function eliminarNegocio(
  negocioId: string,
  confirmarNombre: string,
): Promise<EliminarNegocioResultado> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error('Sesión no válida, iniciá sesión de nuevo.');

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/panel-eliminar-negocio`;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      negocio_id: negocioId,
      confirmar_nombre: confirmarNombre,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.error) {
    throw new Error(data.error ?? 'No se pudo eliminar el negocio');
  }

  return {
    usuariosEliminados: data.usuarios_eliminados as number,
    advertencias: (data.advertencias ?? []) as string[],
  };
}
