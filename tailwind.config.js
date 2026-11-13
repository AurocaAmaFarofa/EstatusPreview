export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        gold: 'var(--gold)',
        purple: 'var(--purple)',
        neon: 'var(--neon)',
        ink: 'var(--bg)',
        graphite: 'var(--surface)',
        cyan: 'var(--gold)',
        turquoise: 'var(--neon)',
        green: 'var(--purple)',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
