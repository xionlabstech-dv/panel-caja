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
