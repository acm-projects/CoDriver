import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from 'expo-router';
import * as Network from 'expo-network'; // Import expo-network

export default function Example() {
  // Use the router from 'expo-router' for navigation
  const router = useRouter();

  // State for managing form input (email and password)
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [ipAddress, setIpAddress] = useState('');
  const [networkState, setNetworkState] = useState(null);

  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
        console.log('Device IP address:', ip); // Log IP address for debugging
      } catch (error) {
        console.error('Failed to get IP address:', error);
      }
    };
    getIpAddress();
  }, []);
  


  const handleSignUp = async () => {
    if (!ipAddress) {
      alert("Could not determine IP address. Check network settings.");
      return;
    }
  
    // Construct the API URL using dynamic IP
    const apiUrl = `http://${ipAddress}:3000/signup`; // Use dynamic IP for device
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email, // Using email as the username
          password: form.password,
        }),
      });
  
      const data = await response.text(); // Handle this based on the API response
      if (response.ok) {
        router.push('/home'); // Navigate to home if signup is successful
      } else {
        alert(data); // Show error message
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed. Please try again.');
    }
  };
  


  // Function to navigate to the login screen
  const navigateToLogin = () => {
    router.push('/login'); // Navigate to the login screen
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Logo container */}
          <View style={styles.logoContainer}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={require('../../assets/images/logo.png')} />
          </View>

          {/* Gradient Title: 'Welcome to' */}
          <MaskedView
            maskElement={
              <Text style={styles.gradientTitle}>Welcome to</Text>
            }>
            <LinearGradient
              colors={['#FF822F', '#FFFFFF']}
              start={[0, 0]}
              end={[1, 1]}>
              <Text style={[styles.gradientTitle, { opacity: 0 }]}>Welcome to</Text>
            </LinearGradient>
          </MaskedView>

          {/* Gradient Title: 'CoDriver' */}
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

          {/* Gradient Subtitle: Description of the app */}
          <MaskedView
            maskElement={
              <Text style={styles.gradientSubtitle}>
                Your new driving companion to make your everyday a little bit safer
              </Text>
            }>
            <LinearGradient
              colors={['#FF822F', '#FFFFFF']}
              start={[0, 0]}
              end={[1, 1]}>
              <Text style={[styles.gradientSubtitle, { opacity: 0 }]}>
                Your new driving companion to make your everyday a little bit safer
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email input */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
              placeholder="john@example.com"
              placeholderTextColor="#ccc"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          {/* Password input */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(text) => setForm(prev => ({ ...prev, password: text }))}
              placeholder="********"
              placeholderTextColor="#ccc"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          {/* Sign up button */}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignUp}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign Up</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Google Sign Up button */}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignUp}>
              <View style={styles.googleBtn}>
                <Image
                  source={{
                    uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png',
                  }}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleBtnText}>Sign Up with Google</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign In / Sign Up footer button */}
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginButtonContainer}>
            <Text style={styles.formFooter}>
              Have an account? <Text style={styles.signUpText}>Sign in here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image placeholder for right corner */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Main container style
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  // Styles for gradient title
  gradientTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  // Styles for subtitle
  gradientSubtitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  /** Header Styles */
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginVertical: 36,
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
    marginBottom: 10,
  },
  /** Form Styles */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
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
  /** Input Styles */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#3D3D3D',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3D3D3D',
    borderStyle: 'solid',
  },
  /** Button Styles */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#1E1E1E',
    borderColor: '#ffffff',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  /** Google Sign-in Button Styles */
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#ffffff',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#000',
  },
});
