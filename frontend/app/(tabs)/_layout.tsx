import { Tabs, useSegments, useRouter, useRootNavigationState } from 'expo-router';
import React from 'react';
import { View, Dimensions } from 'react-native';
import { Pressable } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomHomeTab from '../CustomHomeTab';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const isHomeFocused = segments.length === 1 && segments[0] === 'home';

  // Hide tab bar on login, signup, and index pages
  const isHiddenScreen =
    !segments[1] ||
    segments[1] === 'login' ||
    segments[1] === 'signup';

  // Ensure navigation is initialized before rendering the tab bar
  if (!navigationState?.key) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#CC5500',
        //tabBarInactiveBackgroundColor: 'gray',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: isHiddenScreen
          ? {display: 'none',
            backgroundColor: 'black',
          }
          : {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'black',
            //position: 'absolute',
            bottom: 3,
            height: 100,
            width: '100%',
            paddingHorizontal: 0,
            paddingBottom: 20,
            borderTopWidth: 0, // Optional: removes default border
          },
        
        tabBarIconStyle: {
          width: 30,
          height: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarItemStyle: {
          backgroundColor: 'transparent', // Add this
          flex: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      {/* History tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="list-outline" color={color} />,
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
          tabBarButton: () => {
            const router = useRouter();

            return (
              <Pressable onPress={() => router.push('/home')}>
                <CustomHomeTab color={isHomeFocused ? '#CC5500' : 'gray'} />
              </Pressable>
            );
          },
          tabBarLabel: () => null,
        }}
      />


      {/* Settings tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={34} name="gear" color={color} />,
          tabBarItemStyle: {
            flex: 17, // Equal flex value for all tabs
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