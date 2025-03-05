import { Tabs, useSegments, useRootNavigationState } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments(); // Get current route segments
  const navigationState = useRootNavigationState(); // Ensure navigation is ready



  // Hide tab bar on login, signup, and index pages
  const isHiddenScreen =
    !segments[1] || // Handle index ("/") if second segment is missing
    segments[1] === 'login' ||
    segments[1] === 'signup';

  // Ensure navigation is initialized before rendering the tab bar
  if (!navigationState?.key) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: isHiddenScreen
          ? { display: 'none' } // Hide tab bar for login/signup/index
          : {
            position: 'absolute',
            flexDirection: 'row',  // Arrange tabs in a row
            justifyContent: 'space-between',  // Position Home on the left, Settings on the right
            width: '100%',  // Ensure it spans the full width of the screen
            paddingHorizontal: 20,  // Add padding on the sides
          },
      }}>
      {/* Home tab positioned on the left */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarItemStyle: {
            left: 50, // Adjust this value to move the home icon from the left edge
          },
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
          tabBarItemStyle: {
            right: -160, // Adjust this value to move the settings icon from the right edge
          },
        }}
      />

      {/* Explicitly reference the index screen */}
      <Tabs.Screen
        name="index"  // This references the index screen
        options={{
          title: 'Index',
          tabBarButton: () => null,  // Optionally hide tab bar button here
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarButton: () => null, // Hide the tab button
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Signup',
          tabBarButton: () => null, // Hide the tab button
        }}
      />
    </Tabs>
  );
}
