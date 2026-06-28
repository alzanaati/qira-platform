import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { cairo: ['Cairo', 'sans-serif'] },
      colors: {
        primary: { DEFAULT:'#a855f7', dark:'#7e22ce', light:'#d8b4fe' },
        secondary: '#6366f1',
        dark: { DEFAULT:'#08080f', card:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.08)' },
      },
      animation: {
        'float-up': 'floatUp 2.5s ease-out forwards',
        'pulse-live': 'pulse 1.2s infinite',
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.2s ease',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        floatUp: { '0%': {opacity:'1',transform:'translateY(0) scale(1.2)'}, '100%': {opacity:'0',transform:'translateY(-180px) scale(0.4)'} },
        slideUp: { from: {transform:'translateY(100%)',opacity:'0'}, to: {transform:'translateY(0)',opacity:'1'} },
        fadeIn: { from: {opacity:'0'}, to: {opacity:'1'} },
      },
    },
  },
  plugins: [],
};
export default config;
