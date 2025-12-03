import { Platform, StyleSheet } from 'react-native';

export const palette = {
  background: '#05070f',
  backgroundAlt: '#0a1020',
  accent: '#4ac6ff',
  accentSecondary: '#9f7aff',
  textPrimary: '#e8f0ff',
  textSecondary: '#a9b6d8',
  panel: 'rgba(10, 16, 32, 0.82)',
  borderGlow: 'rgba(74, 198, 255, 0.45)',
  progressTrack: 'rgba(255, 255, 255, 0.08)',
};

const condensedFont = Platform.select({
  ios: 'HelveticaNeue-CondensedBold',
  android: 'sans-serif-condensed',
  default: undefined,
});

export const typography = StyleSheet.create({
  heading: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontFamily: condensedFont,
  },
  body: {
    color: palette.textSecondary,
    fontSize: 14,
    fontFamily: condensedFont,
  },
  label: {
    color: palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: condensedFont,
    letterSpacing: 0.6,
  },
});

export const surfaces = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 20,
  },
  panel: {
    backgroundColor: palette.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.borderGlow,
    padding: 16,
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
});
