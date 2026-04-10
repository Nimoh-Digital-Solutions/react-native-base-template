export const colors = {
  brand: {
    deep: '#1D1228',
    purple: '#7C5FCC',
    accent: '#F97316',
    accentHover: '#EA580C',
    lime: '#6dec13',
    navy: '#161B33',
    navyHover: '#1e2540',
  },
  neutral: {
    50: '#F7F7FA',
    200: '#e0e0e0',
    400: '#9ca3af',
    500: '#6c757d',
    700: '#333333',
    800: '#1f2937',
    900: '#252525',
    950: '#121212',
    white: '#ffffff',
    cream: '#F8F5F2',
    softGray: '#E8E4E1',
    charcoal: '#1A1F2C',
  },
  auth: {
    bgLight: '#F7F7FA',
    bgGlass: 'rgba(255, 255, 255, 0.05)',
    borderGlass: 'rgba(255, 255, 255, 0.1)',
    textOnDark: '#fff',
    textMuted: 'rgba(255, 255, 255, 0.6)',
  },
  text: {
    primary: '#1D1228',
    heading: '#1f2937',
    secondary: '#6c757d',
    subtle: '#9ca3af',
    placeholder: '#9ca3af',
    input: '#1f2937',
    inverse: '#ffffff',
  },
  surface: {
    white: '#ffffff',
    warm: '#F7F7FA',
    input: '#ffffff',
  },
  border: {
    default: '#e0e0e0',
    focus: '#1D1228',
    error: '#ff4757',
  },
  status: {
    error: '#ff4757',
    errorBg: '#ffe6ea',
    errorDark: '#d63447',
    warning: '#ffa502',
    warningBg: '#fff3e0',
    success: '#2ed573',
    successBg: '#e8f5e8',
    successDark: '#1ea557',
    info: '#6c85d3',
  },
  password: {
    weak: '#ff4757',
    medium: '#ffa502',
    strong: '#2ed573',
  },
  offline: {
    banner: '#ff4757',
    reconnected: '#2ed573',
  },
} as const;

export const typography = {
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.96,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  input: {
    fontSize: 15,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  link: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  small: {
    fontSize: 13,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  pill: 100,
} as const;

export const shadows = {
  button: {
    shadowColor: '#1D1228',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
