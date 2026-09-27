'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cerrarSesion } from '@/lib/auth';
import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/negocios', label: 'Negocios' },
  { href: '/crear-negocio', label: 'Crear negocio' },
  { href: '/auditoria', label: 'Auditoría' },
  { href: '/cuenta', label: 'Mi cuenta' },
];

export default function NavBar({ nombre }: { nombre: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);

  async function salir() {
    await cerrarSesion();
    router.replace('/login');
  }

  function claseLink(href: string) {
    return `text-sm ${
      pathname?.startsWith(href) ? 'font-medium text-texto' : 'text-texto-3 hover:text-texto'
    }`;
  }

  return (
    <nav className="border-b border-borde-divisor bg-superficie-barra">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <span className="font-semibold text-texto">Panel Caja</span>

        {/* Escritorio */}
        <div className="hidden flex-1 items-center justify-between pl-8 sm:flex">
          <div className="flex gap-5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={claseLink(link.href)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm text-texto-3">
            <ThemeToggle />
            <span className="truncate">{nombre}</span>
            <button onClick={salir} className="shrink-0 hover:text-texto">
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Móvil */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setAbierto((v) => !v)}
            aria-label="Menú"
            className="rounded-lg p-2 text-texto-3"
          >
            {abierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {abierto && (
        <div className="border-t border-borde-divisor px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAbierto(false)}
                className={claseLink(link.href)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-borde-divisor pt-3 text-sm text-texto-3">
              <span className="truncate">{nombre}</span>
              <button onClick={salir} className="font-medium text-texto-2">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
