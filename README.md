# panel-caja

Panel de administración para el proveedor de Caja: alta de comercios, estado de
pago y suspensión. Next.js 14 (App Router, `output: 'export'`), Tailwind y
Supabase JS. Sitio estático, online-only, pensado para escritorio.

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local # ya viene con los valores del proyecto
npm run dev
```

## Build estático

```bash
npm run build
```

Genera el sitio en `out/`, listo para Cloudflare Pages (proyecto `panel-caja`,
build command `npm run build`, output directory `out`).

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Es el mismo proyecto de Supabase que usa Caja. La `service_role` nunca va
acá — solo como variable de entorno de la Edge Function, configurada desde
el dashboard de Supabase.

## Edge Function `panel-crear-negocio`

Vive en `supabase/functions/panel-crear-negocio/`. Crea el negocio y su
primer usuario admin (requiere `service_role` para `auth.admin.createUser`,
por eso no puede vivir en el cliente).

Deploy:

```bash
supabase functions deploy panel-crear-negocio --project-ref mzbicxpiyfjfamstplqm
```

Variables de entorno de la función (configurar en el dashboard de
Supabase, no en este repo):

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```
