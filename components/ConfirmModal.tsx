'use client';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-base font-semibold text-slate-900">{titulo}</h2>
        <p className="mb-6 text-sm text-slate-600">{mensaje}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {cargando ? 'Aplicando...' : confirmarTexto}
          </button>
        </div>
      </div>
    </div>
  );
}
