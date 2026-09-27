'use client';

import Button from './ui/Button';

interface Props {
  titulo: string;
  mensaje: string;
  confirmarTexto?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  cargando?: boolean;
}

export default function ConfirmModal({
  titulo,
  mensaje,
  confirmarTexto = 'Confirmar',
  onConfirmar,
  onCancelar,
  cargando,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4">
      <div className="w-full max-w-sm rounded-lg bg-tarjeta p-6 shadow-lg">
        <h2 className="mb-2 text-base font-semibold text-texto">{titulo}</h2>
        <p className="mb-6 text-sm text-texto-3">{mensaje}</p>
        <div className="flex justify-end gap-3">
          <Button variante="secundario" compacto onClick={onCancelar} disabled={cargando}>
            Cancelar
          </Button>
          <Button variante="destructivo" compacto onClick={onConfirmar} disabled={cargando}>
            {cargando ? 'Aplicando...' : confirmarTexto}
          </Button>
        </div>
      </div>
    </div>
  );
}
