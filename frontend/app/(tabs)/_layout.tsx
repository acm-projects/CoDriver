import { Tabs, useSegments, useRootNavigationState } from 'expo-router';
import React from 'react';
import { View, Dimensions } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

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
            flexDirection: 'row', // Ensure icons are laid out in a row (horizontally)
            justifyContent: 'space-evenly', // This will add space between the icons evenly
            backgroundColor: 'black',
            bottom: 0,
            height: 100, // Specify the height to match your original design
            width: '100%',
            paddingHorizontal: 0,
            paddingBottom: 20, // Keep some padding for safe area
          },
        tabBarIconStyle: {
          width: 30,
          height: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      {/* History tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
          tabBarItemStyle: {
            flex: 17, // Equal flex value for all tabs
            alignItems: 'center', // Center icons horizontally
            justifyContent: 'center', // Center the icon vertically
          },
        }}
      />

      {/* Home tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarItemStyle: {
            flex: 15, // Equal flex value for all tabs
            alignItems: 'center', // Center icons horizontally
            justifyContent: 'center', // Center the icon vertically
          },
        }}
      />

      {/* Settings tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
          tabBarItemStyle: {
            flex: 15, // Equal flex value for all tabs
            alignItems: 'center', // Center icons horizontally
            justifyContent: 'center', // Center the icon vertically
          },
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="signup"
        options={{
          title: 'Signup',
          tabBarButton: () => null,
        }}
      />

<Tabs.Screen
        name="conversation"
        options={{
          title: 'Conversation',
          tabBarButton: () => null,
        }}
      />
    </Tabs>

  );
}