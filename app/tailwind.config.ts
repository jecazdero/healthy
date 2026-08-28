import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          canvas: '#F7F8F9',
          surface: '#FFFFFF',
          surfaceAlt: '#EEF0F2',
          primary: '#0E8C8C',
          primaryHover: '#0B7373',
          primarySubtle: '#F0FAFA',
          warning: '#FFF7E8',
          urgent: '#FEF1F1',
          success: '#EEFAF3',
        },
        text: {
          primary: '#1B2126',
          secondary: '#414B54',
          tertiary: '#7C8791',
          onPrimary: '#FFFFFF',
          warning: '#B67819',
          urgent: '#A82C2C',
          success: '#1F7A48',
        },
        border: {
          default: '#DDE1E5',
          strong: '#C3C9CF',
          primary: '#0E8C8C',
        },
        icon: {
          primary: '#0B7373',
          muted: '#7C8791',
        },
        status: {
          urgentSolid: '#D64545',
          warningSolid: '#E8A93A',
          successSolid: '#2FA766',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        full: '999px',
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'display-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.3px', fontWeight: '700' }],
        'heading-lg': ['28px', { lineHeight: '36px', letterSpacing: '0', fontWeight: '600' }],
        'heading-md': ['22px', { lineHeight: '28px', letterSpacing: '0', fontWeight: '600' }],
        'heading-sm': ['18px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '26px', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '22px', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.2px', fontWeight: '500' }],
        'numeral-xl': ['64px', { lineHeight: '68px', letterSpacing: '-1px', fontWeight: '700' }],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(13, 26, 31, 0.08)',
        md: '0 4px 12px rgba(13, 26, 31, 0.10)',
        lg: '0 12px 24px rgba(13, 26, 31, 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
