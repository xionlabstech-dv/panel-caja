/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        marca: {
          DEFAULT: 'var(--marca)',
          presion: 'var(--marca-presion)',
          suave: 'var(--marca-suave)',
          'suave-texto': 'var(--marca-suave-texto)',
        },
        foco: 'var(--foco)',
        superficie: {
          DEFAULT: 'var(--superficie)',
          barra: 'var(--superficie-barra)',
        },
        tarjeta: {
          DEFAULT: 'var(--tarjeta)',
          hundida: 'var(--tarjeta-hundida)',
        },
        borde: {
          campo: 'var(--borde-campo)',
          divisor: 'var(--borde-divisor)',
        },
        texto: {
          DEFAULT: 'var(--texto)',
          2: 'var(--texto-2)',
          3: 'var(--texto-3)',
          4: 'var(--texto-4)',
          invertido: 'var(--texto-invertido)',
        },
        negativo: {
          DEFAULT: 'var(--negativo)',
          fondo: 'var(--negativo-fondo)',
        },
        aviso: {
          DEFAULT: 'var(--aviso)',
          fondo: 'var(--aviso-fondo)',
        },
        informativo: {
          DEFAULT: 'var(--informativo)',
          fondo: 'var(--informativo-fondo)',
        },
        overlay: 'var(--overlay)',
      },
      fontFamily: {
        caja: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
