import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  PermissionsAndroid,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';
import SpeechRecognition from '../SpeechRecognition';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [showSpeechRecognition, setShowSpeechRecognition] = useState(false);
  const [isSpeechMounted, setIsSpeechMounted] = useState(false);
  const [loading, setLoading] = useState(false); // Added for loading indicator

  const speechRef = useRef<{ startListening: () => void; stopListening: () => void } | null>(null);
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'We need access to your microphone for speech recognition.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Deny',
            buttonPositive: 'Allow',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission denied');
        } else {
          console.log('Microphone permission granted');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestMicrophonePermission();
  }, []);

  const triggerRipple = () => {
    rippleAnim.setValue(0);
    opacityAnim.setValue(0.5);

    Animated.parallel([
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchAndSpeak = async () => {
    setLoading(true);
    triggerRipple();

    try {
      const response = await fetch('YOUR_BACKEND_API_URL'); // Replace with your actual backend URL
      const data = await response.json();

      if (data.text) {
        Speech.speak(data.text);
      } else {
        console.log("No text received from backend.");
      }
    } catch (error) {
      console.error("Error fetching text:", error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topLeftContainer}>
        <Image
          source={require('../../assets/images/codriver_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.topLeftText}>CoDriver</Text>
      </View>

      {/* Clickable Image with Ripple Effect */}
      <TouchableOpacity onPress={fetchAndSpeak} activeOpacity={0.7} disabled={loading}>
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 4] }) }],
              opacity: opacityAnim,
            },
          ]}
        />
        <Image
          source={require('../../assets/images/AI_Blob.png')}
          style={styles.blobImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="white" style={styles.loader} />}

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.popupTitle}>Hello User</Text>
            <TextInput
              style={styles.input}
              placeholder="Where are you heading today?"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>I'm feeling lucky!</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {showSpeechRecognition && <SpeechRecognition ref={speechRef} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topLeftContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 52,
    height: 52,
    marginRight: 8,
  },
  topLeftText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  blobImage: {
    position: 'absolute',
    width: 550,
    height: 550,
    alignSelf: 'center',
    top: '50%',  
    transform: [{ translateY: 100 }], 
  },
  ripple: {
    position: 'absolute',
    width: 800,
    height: 800,
    alignSelf: 'center',
    top: '50%',  
    transform: [{ translateY: 150 }], 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '85%',
    height: 350,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 24,
    color: 'white',
  },
  popupTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start',
    textAlign: 'left',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
});
