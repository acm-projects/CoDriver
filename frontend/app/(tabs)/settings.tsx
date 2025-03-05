import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Main component for this screen
export default function Example() {
  // Router hook to navigate between pages
  const router = useRouter();


  // State to handle the toggle switch values independently
  const [drivingSuggestions, setDrivingSuggestions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDrivingSuggestions = (value: boolean) => {
    setDrivingSuggestions(value);
  };

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
  };


  // Function to navigate to the login screen
  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.container}>
        {/* Header section */}
        <View style={styles.header}>
          {/* Logo container */}

          <View style={styles.logoContainer}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={require('../../assets/images/logo.png')} />
          </View>


          {/* Gradient text for app name */}
          <MaskedView
            maskElement={
              <Text style={styles.gradientTitle}>CoDriver</Text>
            }>
            <LinearGradient
              colors={['#FF822F', '#FFFFFF']}
              start={[0, 0]}
              end={[1, 1]}>
              <Text style={[styles.gradientTitle, { opacity: 0 }]}>CoDriver</Text>
            </LinearGradient>
          </MaskedView>
        </View>

        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg',
            }}
            style={styles.profileImage}
          />
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Sourish Reddy</Text>
        </View>

        {/* Toggle Switch for driving suggestions */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            Driving Suggestions
          </Text>
          <Switch
            value={drivingSuggestions}
            onValueChange={toggleDrivingSuggestions}
            trackColor={{ false: "#767577", true: "#FF822F" }}
            thumbColor={drivingSuggestions ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#767577", true: "#FF822F" }}
            thumbColor={darkMode ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>

        <View style={styles.companionSection}>

          <TouchableOpacity style={styles.chevronButton}>
            <Text style={styles.chevronText}>Companion </Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.companionSection}>

          <TouchableOpacity style={styles.chevronButton}>
            <Text style={styles.chevronText}>Delete Account </Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={[styles.companionSection, styles.supportSection]}>
          <TouchableOpacity style={styles.chevronButton}>
            <Text style={styles.chevronText}>Support </Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Spotify Connect Button */}
        <View style={styles.formAction}>
          <TouchableOpacity
            onPress={() => {
              // handle Google sign-in
            }}>
            <View style={styles.btn}>
              {/* Google Logo */}
              <Image
                source={{
                  uri: 'https://e7.pngegg.com/pngimages/4/438/png-clipart-spotify-logo-spotify-mobile-app-computer-icons-app-store-music-free-icon-spotify-miscellaneous-logo.png',
                }}
                style={styles.spotifyLogo}
              />

              <Text style={styles.btnText}>Connect to Spotify</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <View style={styles.formAction}>
          <TouchableOpacity
            onPress={() => {
              router.push('/login');
            }}>
            <View style={styles.logOutBtn}>
              <Text style={styles.logOutBtnText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer with contact options */}

      </View>
    </SafeAreaView>
  );
}

// Styling for the components
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  gradientTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: -8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  companionSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#2F2F2F',
    borderRadius: 12,
    padding: 10,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 4,
    width: '100%',
  },
  logoContainer: {
    width: '100%',
    paddingLeft: 0,
    marginLeft: -15,
    alignItems: 'flex-start',
  },
  headerImg: {
    width: 90,
    height: 90,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  signUpText: {
    color: '#FF822F',
    fontWeight: '600',
  },
  loginButtonContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    backgroundColor: '#1ED760',
    borderColor: '#1ED760',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#171938',
  },
  logOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    backgroundColor: '#1E1E1E',
    borderColor: '#ffffff',
  },
  logOutBtnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  chevronButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 2,
    marginTop: 10,
  },
  chevronText: {
    color: 'white',
    fontSize: 16,
    marginRight: 8,
  },
  // Add marginBottom to the Support section to increase space
  supportSection: {
    marginBottom: 30,  // Adjust this value as needed to create more space
  },

  spotifyLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  }

});