'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [oscuro, setOscuro] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem('panel-caja-theme') === 'dark';
    setOscuro(guardado);
    document.documentElement.classList.toggle('dark', guardado);
  }, []);

  function toggle() {
    const siguiente = !oscuro;
    setOscuro(siguiente);
    localStorage.setItem('panel-caja-theme', siguiente ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', siguiente);
  }

  return (
    <button
      onClick={toggle}
      aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="rounded-lg p-2 text-texto-3 transition-colors hover:bg-tarjeta-hundida hover:text-texto"
    >
      {oscuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
