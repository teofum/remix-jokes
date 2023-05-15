import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        'lg': '1024px',
      },
      maxWidth: {
        '2xs': '12rem',
      },
      fontFamily: {
        display: ['Baloo'],
      },
      colors: {
        invalid: 'hsl(356, 100%, 71%)',
        link: 'hsl(48, 100%, 50%)',
        'link-hover': 'hsl(48, 100%, 45%)',
        'link-dark': 'hsl(48, 100%, 30%)',
      },
      textColor: {
        default: 'hsl(0, 0%, 100%)',
        background: 'hsl(278, 73%, 19%)',
      },
      backgroundColor: {
        default: 'hsl(278, 73%, 19%)',
      },
      borderColor: {
        default: 'hsl(277, 85%, 38%)',
      },
      outlineColor: {
        default: 'hsl(277, 85%, 38%)',
      },
      accentColor: {
        default: 'hsl(277, 85%, 38%)',
      },
      boxShadow: {
        button: '0 3px 0 0 var(--tw-shadow-color)',
        'button-hover': '0 4px 0 0 var(--tw-shadow-color)',
        'button-pressed': '0 2px 0 0 var(--tw-shadow-color)',
      },
      backgroundImage: {
        'purple-radial': `radial-gradient(
          circle,
          rgba(152, 11, 238, 1) 0%,
          rgba(118, 15, 181, 1) 35%,
          rgba(58, 13, 85, 1) 100%
        )`,
      },
      flex: {
        'full': '1 1 100%',
      }
    },
  },
  plugins: [],
} satisfies Config;
