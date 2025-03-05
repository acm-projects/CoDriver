import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from 'expo-router';

export default function Example() {
  const router = useRouter(); // Hook for navigation within the app

  // State to store user input for email and password
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Function to handle user signup
  const handleSignUp = async () => {
    console.log("Sending data:", form); // Log form data before sending

    try {
      const response = await fetch('http://192.168.X.X:8000/create-user', { // Use local IP instead of localhost
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailAddress: form.email.trim(), // Change 'email' to 'emailAddress'
          password: form.password.trim(),
          confirmPassword: form.password.trim() // Add confirmPassword if required
        })
      });

      const data = await response.json();
      console.log('Server response:', data); // Log the server response

      if (response.ok) {
        alert('User created successfully');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating user');
    }
  };

  // Function to handle Google sign-in (currently just logs to console)
  const handleSignUpwithGoogle = () => {
    console.log('Sign in with Google pressed');
  };

  // Function to navigate to the signup page
  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.container}>
        {/* Header section containing the logo and text */}
        <View style={styles.header}>

          {/* Logo container */}
          <View style={styles.logoContainer}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={require('../../assets/images/logo.png')} // App logo
            />
          </View>

          {/* Title with gradient effect */}
          <MaskedView maskElement={<Text style={styles.gradientTitle}>CoDriver</Text>}>
            <LinearGradient colors={['#FF822F', '#FFFFFF']} start={[0, 0]} end={[1, 1]}>
              <Text style={[styles.gradientTitle, { opacity: 0 }]}>CoDriver</Text>
            </LinearGradient>
          </MaskedView>

          {/* Subtitle with gradient effect */}
          <MaskedView maskElement={<Text style={styles.gradientSubtitle}>Your companion driver</Text>}>
            <LinearGradient colors={['#FF822F', '#FFFFFF']} start={[0, 0]} end={[1, 1]}>
              <Text style={[styles.gradientSubtitle, { opacity: 0 }]}>To your companion driver</Text>
            </LinearGradient>
          </MaskedView>

        </View>

        {/* Get Started Button */}
        <TouchableOpacity onPress={navigateToSignup} style={styles.googleBtn}>
          <Text style={styles.googleBtnText}>Get Started</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

// Styles for various UI components
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
    marginBottom: 6,
    textAlign: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  gradientSubtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FF822F',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 6,
  },
  header: {
    flex: 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    width: '100%',
    paddingLeft: 0,
    marginLeft: -15,
    alignItems: 'center',
  },
  headerImg: {
    width: 130,
    height: 130,
    marginTop: 10,
    alignSelf: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 64,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#ffffff',
    marginTop: -30,
    alignSelf: 'center',
  },
  googleBtnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#000',
  },
});

