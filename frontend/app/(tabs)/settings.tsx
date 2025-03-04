import React from 'react';
import { View, Text, Switch, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Curved Header */}
      <View style={{ backgroundColor: '#E86A33', padding: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          <Ionicons name="settings" size={24} color="white" /> Settings
        </Text>
      </View>

      {/* Profile Section */}
      <View style={{ margin: 20, padding: 20, backgroundColor: '#252232', borderRadius: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg' }} 
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} 
          />
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Sourish Reddy</Text>
        </View>

        {/* Settings List */}
        <Text style={{ color: 'gray', marginTop: 20 }}>Account Settings</Text>

        {renderSettingItem("Name your Bot")}
        {renderSettingItem("Bot Tone")}
        {renderSettingItem("Connect to Spotify")}
        
        {/* Toggle Buttons */}
        {renderToggleItem("Suggestions")}
        {renderToggleItem("Dark mode")}

        <Text style={{ color: 'gray', marginTop: 20 }}>More</Text>
        {renderSettingItem("Log Out")}
        {renderSettingItem("Delete Account")}
        {renderSettingItem("Support")}
      </View>
    </View>
  );
};

// Helper function to render settings item
const renderSettingItem = (title: String) => (
  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
    <Text style={{ color: 'white' }}>{title}</Text>
    <Ionicons name="chevron-forward" size={18} color="gray" />
  </TouchableOpacity>
);

// Helper function to render toggle items
const renderToggleItem = (title: String) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
    <Text style={{ color: 'white' }}>{title}</Text>
    <Switch value={true} thumbColor="white" trackColor={{ true: '#E86A33', false: 'gray' }} />
  </View>
);

export default SettingsScreen;
