export type Estado = 'activo' | 'restringido' | 'suspendido';

export interface Negocio {
  id: string;
  nombre: string;
  estado: Estado;
  fecha_proximo_pago: string | null;
  estado_nota: string | null;
  estado_actualizado_en: string | null;
  usa_stock: boolean;
  usa_costos: boolean;
  cantidad_usuarios: number;
  creado_en: string;
}

export interface MiCuenta {
  usuario: string;
  nombre: string;
}

export type Rol = 'admin' | 'cajero';

export interface UsuarioNegocio {
  usuario_id: string;
  usuario: string;
  nombre: string | null;
  rol: Rol;
  activo: boolean;
}

export interface AuditoriaEntry {
  ocurrido_en: string;
  superadmin_nombre: string;
  accion: string;
  negocio_nombre: string;
  usuario_afectado: string;
  detalle: string | null;
}
