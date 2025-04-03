import { Tabs, useRouter, useSegments } from 'expo-router'; // Import useSegments
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomHomeTab from '../CustomHomeTab';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments(); // Get route segments

  const isHomeFocused = segments.length === 1 && segments[0] === 'index'; // Determine if home is focused

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: '#CC5500',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="list-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: (props) => (
            <CustomHomeTab color={isHomeFocused ? '#CC5500' : 'gray'} /> // Use isHomeFocused
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}