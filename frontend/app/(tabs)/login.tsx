import React, { useState, useEffect } from 'react';
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
  const router = useRouter(); // Hook for navigation

  // State for handling form inputs (email & password)
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [ipAddress, setIpAddress] = useState('');

  // Fetch the device's IP address once the component is mounted
  useEffect(() => {
    const getIpAddress = async () => {
      const ip = await Network.getIpAddressAsync();
      setIpAddress(ip);
    };
    getIpAddress();
  }, []);

  const handleLogin = async () => {
    if (!ipAddress) {
      alert("Could not determine IP address. Check network settings.");
      return;
    }

    try {
      const response = await fetch(`http://${ipAddress}:3000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email, // Using email as the username
          password: form.password,
        }),
      });

      const textResponse = await response.text(); // Get raw text response
      console.log("Response:", textResponse);  // Log the raw response

      // Only parse if the response is JSON
      if (response.ok) {
        const data = JSON.parse(textResponse);  // Manually parse if it's JSON
        alert(data.message);
        router.push('/home');
      } else {
        alert(textResponse); // Show raw error response
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };






  // Placeholder function for Google Sign Up (yet to be implemented)
  const handleSignUpwithGoogle = () => {
    console.log('Sign in with Google pressed');
  };

  // Function to navigate to signup page
  const navigateToLogin = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.container}>
        <View style={styles.header}>

          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={require('../../assets/images/logo.png')}
            />
          </View>

          {/* Title with Gradient */}
          <MaskedView
            maskElement={<Text style={styles.gradientTitle}>Welcome Back</Text>}>
            <LinearGradient colors={['#FF822F', '#FFFFFF']} start={[0, 0]} end={[1, 1]}>
              <Text style={[styles.gradientTitle, { opacity: 0 }]}>Welcome Back</Text>
            </LinearGradient>
          </MaskedView>

          {/* Subtitle with Gradient */}
          <MaskedView
            maskElement={<Text style={styles.gradientSubtitle}>To your companion driver</Text>}>
            <LinearGradient colors={['#FF822F', '#FFFFFF']} start={[0, 0]} end={[1, 1]}>
              <Text style={[styles.gradientSubtitle, { opacity: 0 }]}>To your companion driver</Text>
            </LinearGradient>
          </MaskedView>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="john@example.com"
              placeholderTextColor="#ffffff"
              style={styles.inputControl}
              value={form.email}
              onChangeText={email => setForm({ ...form, email })}
            />
          </View>

          {/* Password Input */}
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              placeholder="********"
              placeholderTextColor="#ffffff"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
              onChangeText={password => setForm({ ...form, password })}
            />
          </View>

          {/* Sign In Button */}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign In</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign In with Google Button */}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignUpwithGoogle}>
              <View style={styles.googleBtn}>
                <Image
                  source={{
                    uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png',
                  }}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleBtnText}>Sign In with Google</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginButtonContainer}>
            <Text style={styles.formFooter}>
              Don't have an account? <Text style={styles.signUpText}>Sign up here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles for the components
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
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  gradientSubtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FF822F',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
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
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
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
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
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
    fontWeight: '600',
    color: '#fff',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  loginButtonContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  signUpText: {
    color: '#FF822F',
    fontWeight: '600',
  },
});
