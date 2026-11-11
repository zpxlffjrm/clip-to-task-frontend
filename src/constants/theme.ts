/**
 * Theme tokens mirrored from `src/global.css` custom variables.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Hex equivalents of Tailwind tokens used in global.css */
const palette = {
  background: '#020617', // slate-950
  card: '#0f172a', // slate-900
  surface: '#0f172a', // slate-900
  border: '#1e293b', // slate-800
  brandPrimary: '#6366f1', // indigo-500
  brandSecondary: '#8b5cf6', // violet-500
  brandLight: '#a5b4fc', // indigo-300
  action: '#10b981', // emerald-500
  text: '#f8fafc', // slate-50
  textSecondary: '#94a3b8', // slate-400
} as const;

const themeColors = {
  ...palette,
  /** Surface alias for themed components */
  backgroundElement: palette.surface,
  /** Border alias for selected / elevated surfaces */
  backgroundSelected: palette.border,
} as const;

/** CSS defines a single dark palette — applied to both schemes */
export const Colors = {
  light: themeColors,
  dark: themeColors,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Radius = {
  card: 12,
  badge: 6,
  button: 10,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
