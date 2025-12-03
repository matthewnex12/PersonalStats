import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import PersonalStatsApp from './src/App';
import { palette } from './src/theme';

export default function App() {
  return (
    <View style={styles.gradient}>
      <BackgroundGradient />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.frame}>
          <View style={styles.glow} />
          <View style={styles.content}>
            <PersonalStatsApp />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function BackgroundGradient() {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#05070f" />
          <Stop offset="0.5" stopColor="#0c1326" />
          <Stop offset="1" stopColor="#05070f" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" />
      <Rect
        x="20"
        y="40"
        width="90%"
        height="85%"
        fill="url(#bg)"
        opacity={0.35}
        stroke={palette.accentSecondary}
        strokeWidth={1}
        rx={36}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: palette.background,
  },
  safeArea: {
    flex: 1,
    padding: 12,
  },
  frame: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.accent,
    backgroundColor: 'rgba(5, 7, 15, 0.75)',
    shadowColor: palette.accentSecondary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32,
    shadowRadius: 28,
    elevation: 12,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: palette.accentSecondary,
    opacity: 0.25,
  },
  content: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(5, 10, 24, 0.85)',
  },
});
