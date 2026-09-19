/** @type {import('tailwindcss').Config} */
// Every value below is copied directly from the original assets/css/style.css
// :root block and breakpoints — this is the whole point of the PERN rebuild,
// so there is nothing here that is "close enough", it's the same numbers.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Tailwind's defaults (md:768px, lg:1024px) already match the site's own
    // two breakpoints (max-width:767px mobile, max-width:1024px tablet), so
    // no override is needed — just build mobile-first as Tailwind expects.
    container: {
      center: true,
      padding: '24px',
      screens: { DEFAULT: '1200px' }, // --container: 1200px
    },
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#00B5E2',
          600: '#0098C0',
          700: '#007A9B',
        },
        coral: {
          DEFAULT: '#E9897E',
          600: '#D96A5D',
        },
        'grey-brand': '#D8D8D8',
        ink: {
          DEFAULT: '#0A2A33',
          800: '#0F3A46',
          700: '#164A59',
        },
        muted: '#5E7A82',
        line: {
          DEFAULT: '#E3EBEE',
          deep: '#C9D8DD',
          deeper: '#B9D2DA',
        },
        sand: {
          DEFAULT: '#F4F8FA',
          deep: '#E9F2F5',
        },
        // Muted text tones used on dark (ink) backgrounds — e.g. lead copy,
        // breadcrumbs and nav links inside the header/footer/hero/admin
        // shell. Numbered lightest (100) to darkest (700), each value
        // carried over as-is from the original source CSS.
        haze: {
          100: '#D6E5EA',
          200: '#C6DCE3',
          300: '#C6D9DF',
          400: '#BCD6DE',
          500: '#A9C6CF',
          600: '#9FBFC9',
          700: '#8FB2BD',
        },
        gold: '#FFB400',
        mint: '#4ADE80',
        success: {
          DEFAULT: '#15803D',
          bg: '#DCFCE7',
        },
        'coral-wash': '#FFF6F5',
      },
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      spacing: {
        // --s-1 .. --s-8, the 8px rhythm the whole layout is built on
        s1: '8px',
        s2: '16px',
        s3: '24px',
        s4: '32px',
        s5: '48px',
        s6: '64px',
        s7: '88px',
        s8: '120px',
      },
      borderRadius: {
        DEFAULT: '18px',
        sm: '12px',
        lg: '28px',
      },
      boxShadow: {
        sm: '0 2px 10px rgba(10,42,51,.06)',
        DEFAULT: '0 10px 34px rgba(10,42,51,.09)',
        lg: '0 26px 60px rgba(10,42,51,.16)',
        'btn-primary': '0 8px 22px rgba(0,181,226,.28)',
        'btn-primary-hover': '0 14px 30px rgba(0,181,226,.36)',
        'btn-coral': '0 8px 22px rgba(233,137,126,.32)',
        'btn-coral-hover': '0 14px 30px rgba(233,137,126,.4)',
        card: '0 10px 34px rgba(10,42,51,.09)',
      },
      keyframes: {
        pulse: {
          '70%': { boxShadow: '0 0 0 9px rgba(74,222,128,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(74,222,128,0)' },
        },
        kenburns: {
          from: { transform: 'scale(1.04) translateX(0)' },
          to: { transform: 'scale(1.14) translateX(-1.4%)' },
        },
      },
      animation: {
        pulse: 'pulse 2.2s infinite',
        kenburns: 'kenburns 26s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
