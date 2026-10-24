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
  precio_mensual: number | null;
  limite_usuarios: number;
  limite_productos: number | null;
  cantidad_productos: number;
  es_prueba: boolean;
  nombre_comercial: string | null;
  solicitud_eliminacion_en: string | null;
  usa_cuentas_pagar: boolean;
  usa_iva: boolean;
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

export type Moneda = 'USD' | 'Bs';

export interface PagoLicencia {
  id: string;
  negocio_id: string;
  negocio_nombre: string;
  fecha_pago: string;
  periodo_desde: string;
  periodo_hasta: string;
  monto: number;
  moneda: Moneda;
  tasa: number | null;
  // Calculado por la base. Puede venir null si el pago quedó en Bs sin tasa,
  // algo que la base ya no permite pero que conviene no asumir imposible.
  monto_usd: number | null;
  metodo: string | null;
  referencia: string | null;
  nota: string | null;
  registrado_por_nombre: string | null;
  creado_en: string;
}
