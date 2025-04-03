import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter, usePathname } from 'expo-router';

interface CustomHomeTabProps {
  color: string;
}

const CustomHomeTab = ({ color }: CustomHomeTabProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = () => {
    console.log("Current Pathname:", pathname);
    if (pathname !== '/') {
      console.log("Navigating to /index");
      router.push('/');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.circle}>
        <View style={styles.glassEffect} />
        <IconSymbol size={36} name="house.fill" color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 36,
    backgroundColor: '#CC5500',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  glassEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    zIndex: 1,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
});

export default CustomHomeTab;