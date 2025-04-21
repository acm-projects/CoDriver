import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlurTabBarBackground() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', height: 100 + bottom }]} />
  );
}

export function useBottomTabOverflow() {
  // This part remains the same as you're calculating the overflow
  const bottom = useSafeAreaInsets().bottom;
  return 100 - bottom; // Assuming your tab bar height is 100
}