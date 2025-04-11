import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';
import AISettingsSlider from '../../components/AISettingsSlider';
//import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Example() {
  const [drivingSuggestions, setDrivingSuggestions] = useState(false);
  const router = useRouter();
  // ANUSHA-Mock user ID for testing - replace with actual user ID from authentication
  const userId = "67f4838bb472b62e1ce8bc43";

  const toggleDrivingSuggestions = (value: boolean) => {
    setDrivingSuggestions(value);
  };

  // Function to navigate to the login screen
  const navigateToLogin = () => {
    router.push('/login');
  };

  // ANUSHA handle AI settings changes
  const handleAISettingsChange = (settings: any) => {
    console.log('AI settings updated:', settings);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.header}>
        <View style={styles.backgroundOverlay} />
        <View style={styles.waveContainer}>
          <Image
            source={require('../../assets/images/Vector.png')}
            style={styles.waveImage}
          />
        </View>
        <Text style={styles.waveTitle}>Settings</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.container}>
          <View style={styles.header}>

            <MaskedView
              maskElement={<Text style={styles.gradientTitle}>CoDriver</Text>}>
              <LinearGradient colors={['#FF822F', '#FFFFFF']} start={[0, 0]} end={[1, 1]}>
                {/* No need for another Text component here */}
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
          
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Driving Suggestions</Text>
            <Switch
              value={drivingSuggestions}
              onValueChange={toggleDrivingSuggestions}
              trackColor={{ false: "#767577", true: "#FF822F" }}
              thumbColor={drivingSuggestions ? "#FFFFFF" : "#f4f3f4"}
            />
      
            
          </View>
          
          {/* ANUSHA AI Settings Slider Component - Only show when driving suggestions is on */}
          {/* {drivingSuggestions && (
            <AISettingsSlider 
              userId={userId}
              onSettingsChange={handleAISettingsChange}
            />
          )} */}
          
          <View style={styles.companionSection}>
            <TouchableOpacity style={styles.chevronButton}>
              <Text style={styles.chevronText}>Companion</Text>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </TouchableOpacity>

          </View>
          <View style={styles.companionSection}>
            <TouchableOpacity style={styles.chevronButton}>
              <Text style={styles.chevronText}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <View style={[styles.companionSection, styles.supportSection]}>
            <TouchableOpacity style={styles.chevronButton}>
              <Text style={styles.chevronText}>Support</Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 150,
  },
  waveImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  waveTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 90,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2F2F2F',
    borderRadius: 12,
    padding: 10,
    marginTop: 20
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  companionSection: {
    alignItems: 'center',
    marginVertical: 15,
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
  supportSection: {
    marginBottom: 30,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: -70,
    right: -20,
    width: '200%',
    height: 90, // Adjust height for extra fill
    backgroundColor: '#E17636', // Match background color or use a different fill color
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
    marginLeft: 0,
    marginTop: -95
  },


  gradientTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: -8,
    textAlign: 'left',
    alignSelf: 'flex-start',
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




  spotifyLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

});