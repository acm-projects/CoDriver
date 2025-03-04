import React, { useState } from 'react';
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

export default function Example() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://10.178.172.194:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.email, // Using email as the username
          password: form.password,
        }),
      });

      const data = await response.text(); // Change this based on response structure
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

  

  

  const navigateToLogin = () => {
    // Navigate to the login screen using router
    router.push('/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Logo container */}
          <View style={styles.logoContainer}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={require('../../assets/images/logo.png')} />
          </View>

          {/* Welcome title */}
          <MaskedView
            maskElement={
              <Text style={styles.gradientTitle}>Welcome to</Text>
            }>
            <LinearGradient
              colors={['#FF822F', '#FFFFFF']}
              start={[0, 0]}
              end={[1, 1]}>
              <Text style={[styles.gradientTitle, {opacity: 0}]}>Welcome to</Text>
            </LinearGradient>
          </MaskedView>
          
          {/* App name */}
          <MaskedView
            maskElement={
              <Text style={styles.gradientTitle}>CoDriver</Text>
            }>
            <LinearGradient
              colors={['#FF822F', '#FFFFFF']}
              start={[0, 0]}
              end={[1, 1]}>
              <Text style={[styles.gradientTitle, {opacity: 0}]}>CoDriver</Text>
            </LinearGradient>
          </MaskedView>

          {/* App subtitle */}
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
              <Text style={[styles.gradientSubtitle, {opacity: 0}]}>
                Your new driving companion to make your everyday a little bit safer
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>

        <View style={styles.form}>
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

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignUp}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign Up</Text>
              </View>
            </TouchableOpacity>
          </View>

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

          {/* Sign In / Sign Up footer as button */}
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginButtonContainer}>
            <Text style={styles.formFooter}>
              Have an account? <Text style={styles.signUpText}>Sign in here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image placed in the right corner */}
      
    </SafeAreaView>
  );
}

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
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  /** Header */
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
  /** Form */
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
  /** Input */
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
  /** Button */
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
  /** Google Sign-in Button */
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
