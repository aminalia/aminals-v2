/**
 * Design tokens - the single source of truth for all design decisions
 * This file combines all theme tokens into a cohesive design system
 */

import { colors, semanticColors, tailwindColors } from './colors';
import { layout, componentSpacing, breakpoints, tailwindSpacing } from './spacing';
import { typography, textStyles, tailwindTextStyles } from './typography';

/**
 * Complete design token system
 */
export const tokens = {
  colors,
  semanticColors,
  typography,
  textStyles,
  layout,
  componentSpacing,
  breakpoints,
} as const;

/**
 * Tailwind CSS configuration tokens
 */
export const tailwindTokens = {
  colors: tailwindColors,
  spacing: tailwindSpacing,
  textStyles: tailwindTextStyles,
  extend: {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    borderRadius: layout.borderRadius,
    boxShadow: layout.boxShadow,
    zIndex: layout.zIndex,
    screens: breakpoints,
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
  },
} as const;

/**
 * CSS custom properties for runtime theming
 */
export const cssVariables = {
  // Color variables
  '--color-primary-50': colors.primary[50],
  '--color-primary-100': colors.primary[100],
  '--color-primary-200': colors.primary[200],
  '--color-primary-300': colors.primary[300],
  '--color-primary-400': colors.primary[400],
  '--color-primary-500': colors.primary[500],
  '--color-primary-600': colors.primary[600],
  '--color-primary-700': colors.primary[700],
  '--color-primary-800': colors.primary[800],
  '--color-primary-900': colors.primary[900],

  '--color-success-50': colors.success[50],
  '--color-success-100': colors.success[100],
  '--color-success-600': colors.success[600],
  '--color-success-700': colors.success[700],

  '--color-error-50': colors.error[50],
  '--color-error-100': colors.error[100],
  '--color-error-600': colors.error[600],
  '--color-error-700': colors.error[700],

  '--color-love-50': colors.love[50],
  '--color-love-100': colors.love[100],
  '--color-love-600': colors.love[600],
  '--color-love-700': colors.love[700],

  '--color-energy-50': colors.energy[50],
  '--color-energy-100': colors.energy[100],
  '--color-energy-600': colors.energy[600],
  '--color-energy-700': colors.energy[700],

  '--color-neutral-50': colors.neutral[50],
  '--color-neutral-100': colors.neutral[100],
  '--color-neutral-200': colors.neutral[200],
  '--color-neutral-300': colors.neutral[300],
  '--color-neutral-400': colors.neutral[400],
  '--color-neutral-500': colors.neutral[500],
  '--color-neutral-600': colors.neutral[600],
  '--color-neutral-700': colors.neutral[700],
  '--color-neutral-800': colors.neutral[800],
  '--color-neutral-900': colors.neutral[900],

  // Background variables
  '--color-background-primary': colors.background.primary,
  '--color-background-secondary': colors.background.secondary,
  '--color-background-tertiary': colors.background.tertiary,
  '--color-background-inverse': colors.background.inverse,

  // Text variables
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-tertiary': colors.text.tertiary,
  '--color-text-inverse': colors.text.inverse,
  '--color-text-disabled': colors.text.disabled,

  // Border variables
  '--color-border-primary': colors.border.primary,
  '--color-border-secondary': colors.border.secondary,
  '--color-border-tertiary': colors.border.tertiary,
  '--color-border-focus': colors.border.focus,

  // Spacing variables
  '--spacing-xs': layout.padding.xs,
  '--spacing-sm': layout.padding.sm,
  '--spacing-md': layout.padding.md,
  '--spacing-lg': layout.padding.lg,
  '--spacing-xl': layout.padding.xl,
  '--spacing-2xl': layout.padding['2xl'],

  // Border radius variables
  '--radius-sm': layout.borderRadius.sm,
  '--radius-base': layout.borderRadius.base,
  '--radius-md': layout.borderRadius.md,
  '--radius-lg': layout.borderRadius.lg,
  '--radius-xl': layout.borderRadius.xl,
  '--radius-2xl': layout.borderRadius['2xl'],
  '--radius-3xl': layout.borderRadius['3xl'],
  '--radius-full': layout.borderRadius.full,

  // Shadow variables
  '--shadow-sm': layout.boxShadow.sm,
  '--shadow-base': layout.boxShadow.base,
  '--shadow-md': layout.boxShadow.md,
  '--shadow-lg': layout.boxShadow.lg,
  '--shadow-xl': layout.boxShadow.xl,
  '--shadow-2xl': layout.boxShadow['2xl'],
} as const;

/**
 * Theme configuration (light mode only)
 */
export const theme = {
  ...cssVariables,
  '--color-mode': 'light',
} as const;

/**
 * Utility functions for token usage
 */
export const tokenUtils = {
  // Get color value by path
  getColor: (path: string) => {
    const parts = path.split('.');
    let current: any = colors;
    for (const part of parts) {
      current = current?.[part];
    }
    return current;
  },

  // Get semantic color value
  getSemanticColor: (path: string) => {
    const parts = path.split('.');
    let current: any = semanticColors;
    for (const part of parts) {
      current = current?.[part];
    }
    return current;
  },

  // Get spacing value
  getSpacing: (size: keyof typeof layout.padding) => {
    return layout.padding[size];
  },

  // Get text style classes
  getTextStyle: (style: keyof typeof tailwindTextStyles) => {
    return tailwindTextStyles[style];
  },
} as const;

// Export everything for easy importing
export * from './colors';
export * from './spacing';
export * from './typography';
export default tokens;