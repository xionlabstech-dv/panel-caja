'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cerrarSesion } from '@/lib/auth';

const links = [
  { href: '/negocios', label: 'Negocios' },
  { href: '/crear-negocio', label: 'Crear negocio' },
  { href: '/auditoria', label: 'Auditoría' },
  { href: '/cuenta', label: 'Mi cuenta' },
];

export default function NavBar({ nombre }: { nombre: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function salir() {
    await cerrarSesion();
    router.replace('/login');
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-semibold text-slate-900">Panel Caja</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${
                  pathname?.startsWith(link.href)
                    ? 'font-medium text-slate-900'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="truncate">{nombre}</span>
          <button onClick={salir} className="shrink-0 text-slate-500 hover:text-slate-900">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
