/**
 * Spacing scale and layout tokens for the Aminals application
 */

export const spacing = {
  // Base spacing scale (in rem)
  0: '0',
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
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

/**
 * Semantic spacing tokens for common use cases
 */
export const layout = {
  // Container widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    max: '1400px', // Current max-width used in app
  },

  // Common padding values
  padding: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
    '2xl': spacing[12],
  },

  // Common margin values
  margin: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
    '2xl': spacing[12],
  },

  // Common gap values for flex/grid
  gap: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[3],
    lg: spacing[4],
    xl: spacing[6],
    '2xl': spacing[8],
  },

  // Border radius values
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Box shadow values
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Z-index values
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50', // Current mobile nav z-index
    60: '60',
    70: '70',
    80: '80',
    90: '90',
    100: '100',
  },
} as const;

/**
 * Component-specific spacing tokens
 */
export const componentSpacing = {
  // Card spacing
  card: {
    padding: layout.padding.lg,
    gap: layout.gap.md,
    borderRadius: layout.borderRadius.xl,
  },

  // Button spacing
  button: {
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[2.5]} ${spacing[4]}`,
      lg: `${spacing[3]} ${spacing[6]}`,
    },
    borderRadius: layout.borderRadius.md,
    gap: layout.gap.sm,
  },

  // Form spacing
  form: {
    fieldGap: layout.gap.lg,
    labelGap: layout.gap.sm,
    inputPadding: `${spacing[2.5]} ${spacing[3]}`,
    borderRadius: layout.borderRadius.md,
  },

  // Navigation spacing
  nav: {
    padding: layout.padding.md,
    gap: layout.gap.md,
    itemPadding: `${spacing[2]} ${spacing[3]}`,
  },

  // Page layout spacing
  page: {
    containerPadding: layout.padding.md,
    sectionGap: layout.gap.xl,
    contentGap: layout.gap.lg,
  },

  // Aminals-specific spacing
  aminal: {
    cardPadding: layout.padding.md,
    statsGap: layout.gap.md,
    actionGap: layout.gap.sm,
  },
} as const;

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Tailwind CSS class mappings for spacing
 */
export const tailwindSpacing = {
  // Common padding classes
  paddingSmall: 'p-2',
  paddingMedium: 'p-4',
  paddingLarge: 'p-6',
  paddingXLarge: 'p-8',

  // Common margin classes
  marginSmall: 'm-2',
  marginMedium: 'm-4',
  marginLarge: 'm-6',
  marginXLarge: 'm-8',

  // Common gap classes
  gapSmall: 'gap-2',
  gapMedium: 'gap-3',
  gapLarge: 'gap-4',
  gapXLarge: 'gap-6',

  // Container classes
  container: 'container max-w-5xl mx-auto px-4 py-8',
  containerSmall: 'container max-w-3xl mx-auto px-4 py-6',
  containerLarge: 'container max-w-7xl mx-auto px-4 py-12',
} as const;