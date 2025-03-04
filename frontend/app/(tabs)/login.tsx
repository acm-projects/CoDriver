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

  const handleLogin = async () => {
    try {
        const response = await fetch('http://10.178.172.194:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: form.email, // Using email as the username
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


  
  
  

  const handleSignUp = () => {
    // Add your sign up navigation logic here
    console.log('Sign in with Google pressed');
  };

  const handleSignUpwithGoogle = () => {
    // Add your sign up navigation logic here
    console.log('Sign in with Google pressed');
  };

  const navigateToLogin = () => {
    // Navigate to the login screen using router
    router.push('/signup');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Modified the logo container to be more to the left */}
          <View style={styles.logoContainer}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={require('/Users/siddharthasomalinga/Downloads/CoDriver/frontend/assets/images/logo.png')} />
          </View>

          {/* First part of the title always shows */}
          <MaskedView
              maskElement={
                <Text style={styles.gradientTitle}>Welcome Back</Text>
              }>
              <LinearGradient
                colors={['#FF822F', '#FFFFFF']}
                start={[0, 0]}
                end={[1, 1]}>
                <Text style={[styles.gradientTitle, {opacity: 0}]}>Welcome Back</Text>
              </LinearGradient>
            </MaskedView>
          
          {/* Subtitle */}
          <MaskedView
              maskElement={
                <Text style={styles.gradientSubtitle}>To your companion driver</Text>
              }>
              <LinearGradient
                colors={['#FF822F', '#FFFFFF']}
                start={[0, 0]}
                end={[1, 1]}>
                <Text style={[styles.gradientSubtitle, {opacity: 0}]}>To your companion driver</Text>
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
              onChangeText={email => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#ffffff"
              style={styles.inputControl}
              value={form.email} />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={password => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#ffffff"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password} />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign In</Text>
              </View>
            </TouchableOpacity>
          </View>

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

          {/* Sign In / Sign Up footer */}
          <TouchableOpacity onPress={navigateToLogin} style={styles.loginButtonContainer}>
                      <Text style={styles.formFooter}>
                        Don't have an account? <Text style={styles.signUpText}>Sign in here</Text>
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
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  gradientTitle: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FF822F',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  gradientSubtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FF822F',
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
  // Modified logoContainer to push logo further left
  logoContainer: {
    width: '100%',
    paddingLeft: 0,
    marginLeft: -15, // Increased from -10 to -20 to push more to the left
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
    paddingVertical: 24,
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
    color: '#ffffff',
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
  loginButtonContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});