// Edge Function: panel-crear-negocio
// Crea un negocio nuevo junto con su primer usuario admin.
// Requiere service_role porque crear un usuario en auth no se puede hacer desde el cliente.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const USUARIO_REGEX = /^[a-zA-Z0-9_.-]+$/;

function usuarioAEmail(usuario: string): string {
  let email = usuario.trim().toLowerCase();
  if (!email.includes('@')) email += '@caja.app';
  return email;
}

async function buscarUsuarioPorEmail(
  // deno-lint-ignore no-explicit-any
  supabaseAdmin: any,
  email: string,
): Promise<boolean> {
  const perPage = 1000;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const usuarios = data?.users ?? [];
    if (usuarios.some((u: { email?: string }) => u.email?.toLowerCase() === email)) {
      return true;
    }
    if (usuarios.length < perPage) break;
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'No autorizado' }, 401);
  }

  // Cliente con el JWT de quien llama, para saber quién es.
  const supabaseCaller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  // Cliente con service_role, para operaciones privilegiadas.
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const {
    data: { user: caller },
    error: callerError,
  } = await supabaseCaller.auth.getUser();

  if (callerError || !caller) {
    return jsonResponse({ error: 'No autorizado' }, 401);
  }

  const { data: superadmin, error: superadminError } = await supabaseAdmin
    .from('superadmins')
    .select('id, activo')
    .eq('id', caller.id)
    .eq('activo', true)
    .maybeSingle();

  if (superadminError) {
    return jsonResponse({ error: 'No se pudo verificar el usuario' }, 500);
  }

  if (!superadmin) {
    return jsonResponse({ error: 'No autorizado' }, 403);
  }

  let body: { nombre_negocio?: string; usuario?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Cuerpo de la petición inválido' }, 400);
  }

  const nombreNegocio = body.nombre_negocio?.trim() ?? '';
  const usuario = body.usuario?.trim() ?? '';
  const password = body.password ?? '';

  if (!nombreNegocio) {
    return jsonResponse({ error: 'El nombre del negocio es obligatorio' }, 400);
  }
  if (usuario.length < 3) {
    return jsonResponse({ error: 'El usuario debe tener al menos 3 caracteres' }, 400);
  }
  if (!USUARIO_REGEX.test(usuario)) {
    return jsonResponse(
      { error: 'El usuario solo puede tener letras, números, guiones, puntos y guión bajo' },
      400,
    );
  }
  if (password.length < 8) {
    return jsonResponse({ error: 'La contraseña debe tener al menos 8 caracteres' }, 400);
  }

  const email = usuarioAEmail(usuario);

  let existente = false;
  try {
    existente = await buscarUsuarioPorEmail(supabaseAdmin, email);
  } catch {
    return jsonResponse({ error: 'No se pudo verificar el usuario' }, 500);
  }
  if (existente) {
    return jsonResponse({ error: 'Ese usuario ya está en uso' }, 400);
  }

  const { data: negocioId, error: negocioError } = await supabaseAdmin.rpc('panel_crear_negocio', {
    p_nombre: nombreNegocio,
  });

  if (negocioError || !negocioId) {
    return jsonResponse({ error: negocioError?.message ?? 'No se pudo crear el negocio' }, 400);
  }

  const { data: nuevoUsuario, error: crearUsuarioError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (crearUsuarioError || !nuevoUsuario?.user) {
    return jsonResponse(
      { error: crearUsuarioError?.message ?? 'No se pudo crear el usuario admin' },
      400,
    );
  }

  const nuevoUsuarioId = nuevoUsuario.user.id;

  const { error: perfilError } = await supabaseAdmin.from('perfiles').insert({
    id: nuevoUsuarioId,
    negocio_id: negocioId,
    rol: 'admin',
  });

  if (perfilError) {
    // No dejar un usuario huérfano sin perfil.
    await supabaseAdmin.auth.admin.deleteUser(nuevoUsuarioId);
    return jsonResponse({ error: 'No se pudo crear el perfil del usuario admin' }, 500);
  }

  return jsonResponse({ negocio_id: negocioId, usuario_id: nuevoUsuarioId });
});
