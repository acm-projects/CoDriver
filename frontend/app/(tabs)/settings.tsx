import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Switch, // Make sure to import Switch
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
  
  // Toggle state
  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = (value) => {
    setSwitchValue(value);
  };

  const handleSignUp = () => {
    // Add your sign up navigation logic here
    console.log('Sign up pressed');
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
          
        </View>

        

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Name your companion</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="john"
              placeholderTextColor="#ffffff"
              style={styles.inputControl}
              value={form.email} />
          </View>

          {/* Toggle Switch Section */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {switchValue ? 'Driving Suggestions' : 'Driving Suggestions'}
          </Text>
          <Switch
            value={switchValue}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#767577", true: "#FF822F" }}
            thumbColor={switchValue ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>

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
                  style={styles.googleLogo}
                />

                <Text style={styles.btnText}>Connect to Spotify</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => {
                // handle Google sign-in
              }}>
              <View style={styles.googleBtn}>
                {/* Google Logo */}
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

          <View style={styles.formAction}>
            <TouchableOpacity
              onPress={() => {
                // handle Google sign-in
              }}>
              <View style={styles.logOutBtn}>
                <Text style={styles.logOutBtnText}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Sign In / Sign Up footer as button */}
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginButtonContainer}>
            <Text style={styles.formFooter}>
              Delete your Account
            </Text>
            <Text style={styles.formFooter}>
              Need some help? <Text style={styles.signUpText}>Contact Us</Text>
            </Text>
           
          </TouchableOpacity>
        </View>
      </View>
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
  /** Toggle container */
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    backgroundColor: '#3D3D3D',
    borderRadius: 12,
    padding: 10,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
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
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
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