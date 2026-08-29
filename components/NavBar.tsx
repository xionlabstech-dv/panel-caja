'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cerrarSesion } from '@/lib/auth';

const links = [
  { href: '/negocios', label: 'Negocios' },
  { href: '/crear-negocio', label: 'Crear negocio' },
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="font-semibold text-slate-900">Panel Caja</span>
          <div className="flex gap-4">
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
          <span>{nombre}</span>
          <button onClick={salir} className="text-slate-500 hover:text-slate-900">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
