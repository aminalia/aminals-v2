/**
 * Color palette for the Aminals application
 * Based on current usage patterns and semantic meanings
 */

export const colors = {
  // Brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Aminals-specific semantic colors
  love: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },

  energy: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Neutral colors (grays)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    inverse: '#0f172a',
  },

  // Text colors
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
    disabled: '#cbd5e1',
  },

  // Border colors
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    focus: '#3b82f6',
  },
} as const;

/**
 * Semantic color mappings for easier component usage
 */
export const semanticColors = {
  // Component-specific semantic colors
  card: {
    background: colors.background.primary,
    border: colors.border.primary,
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  button: {
    primary: {
      background: colors.primary[600],
      backgroundHover: colors.primary[700],
      text: colors.text.inverse,
    },
    secondary: {
      background: colors.neutral[100],
      backgroundHover: colors.neutral[200],
      text: colors.text.primary,
      border: colors.border.primary,
    },
    success: {
      background: colors.success[600],
      backgroundHover: colors.success[700],
      text: colors.text.inverse,
    },
    error: {
      background: colors.error[600],
      backgroundHover: colors.error[700],
      text: colors.text.inverse,
    },
  },

  // Aminals-specific semantic colors
  aminal: {
    love: {
      background: colors.love[100],
      text: colors.love[700],
      icon: colors.love[600],
    },
    energy: {
      background: colors.energy[100],
      text: colors.energy[700],
      icon: colors.energy[600],
    },
    breeding: {
      background: colors.love[50],
      text: colors.love[800],
      accent: colors.love[600],
    },
    genes: {
      background: colors.primary[50],
      text: colors.primary[800],
      accent: colors.primary[600],
    },
  },

  // State colors
  state: {
    hover: 'rgba(0, 0, 0, 0.05)',
    active: 'rgba(0, 0, 0, 0.1)',
    disabled: colors.neutral[200],
    focus: colors.primary[500],
  },
} as const;

/**
 * Export individual color tokens for Tailwind config
 */
export const tailwindColors = {
  primary: colors.primary,
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  love: colors.love,
  energy: colors.energy,
  neutral: colors.neutral,
} as const;