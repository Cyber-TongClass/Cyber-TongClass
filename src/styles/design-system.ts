// Yale-inspired Design System for tongclass.ac.cn
// Based on: Clean, minimal, academic, premium

export const colors = {
  // Primary palette - Yale-inspired
  primary: {
    DEFAULT: '#0F4C81', // Yale Blue
    light: '#1E6BA8',
    dark: '#0A3559',
    50: '#EEF4F9',
    100: '#D5E4F0',
    200: '#ABC9E1',
    300: '#81AED2',
    400: '#5793C3',
    500: '#2F78B4',
    600: '#0F4C81',
    700: '#0B3A63',
    800: '#072845',
    900: '#031627',
  },
  
  // Neutral palette - Clean grays
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#121212',
  },
  
  // Accent colors
  accent: {
    crimson: '#DC143C', // Academic crimson
    gold: '#CFB53B',    // Old gold
    success: '#2E7D32',
    warning: '#F57C00',
    error: '#D32F2F',
    info: '#1976D2',
  },
  
  // Semantic colors
  background: {
    DEFAULT: '#FFFFFF',
    muted: '#F8F9FA',
    subtle: '#F1F3F4',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  foreground: {
    DEFAULT: '#1A1A1A',
    muted: '#6B7280',
    subtle: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Border colors
  border: {
    DEFAULT: '#E5E7EB',
    light: '#F3F4F6',
    dark: '#D1D5DB',
    focus: '#0F4C81',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const spacing = {
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export const transitions = {
  DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
} as const;

// Animation durations
export const durations = {
  instant: '0ms',
  fast: '100ms',
  DEFAULT: '150ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '1000ms',
} as const;

// Custom design tokens for the project
export const custom = {
  // Card styles
  card: {
    padding: '1.5rem',
    borderRadius: '0.5rem',
    background: 'white',
    shadow: shadows.md,
  },
  
  // Button variants
  button: {
    primary: {
      background: colors.primary.DEFAULT,
      color: 'white',
      hover: colors.primary.dark,
    },
    secondary: {
      background: colors.neutral[100],
      color: colors.foreground.DEFAULT,
      hover: colors.neutral[200],
    },
    ghost: {
      background: 'transparent',
      color: colors.foreground.DEFAULT,
      hover: colors.neutral[100],
    },
    danger: {
      background: colors.accent.error,
      color: 'white',
      hover: '#B71C1C',
    },
  },
  
  // Input styles
  input: {
    border: `1px solid ${colors.border.DEFAULT}`,
    borderRadius: '0.375rem',
    padding: '0.5rem 0.75rem',
    focus: `2px solid ${colors.border.focus}`,
    placeholder: colors.foreground.subtle,
  },
  
  // Navigation
  nav: {
    height: '4rem',
    background: 'white',
    borderBottom: `1px solid ${colors.border.DEFAULT}`,
  },
  
  // Container
  container: {
    maxWidth: '1280px',
    padding: '0 1rem',
  },
} as const;
