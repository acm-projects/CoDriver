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
import addressData from '../../assets/addresses.json';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState(''); // Added state for destination
  const [suggestions, setSuggestions] = useState<string[]>([]);

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
      const response = await fetch('YOUR_BACKEND_API_URL');
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

  const handleInputChange = (text: string) => {
      setDestination(text);
    
      if (text.length > 1) {
        const filtered = addressData.filter((address: string) =>
          address.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 3)); // Limit to number of suggestions
      } else {
        setSuggestions([]);
      }
    };
    

  const handleFeelingLucky = () => {
    setModalVisible(false);
    // You can add logic here to use the 'destination' state if needed
    console.log("Destination:", destination); // Example: Log the destination
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
                value={destination}
                onChangeText={handleInputChange}
                selectionColor="white"
            />

            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setDestination(item);
                  setSuggestions([]); // Clear suggestions
                }}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}


            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Go to Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(195, 186, 186, 0.44)',
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
    fontSize: 30,
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
    //backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    alignSelf: 'flex-start',
    textAlign: 'left',
    //textAlignVertical: 'center',
    borderBottomWidth: 1, // Added to create the bottom underline
    borderBottomColor: 'white', // Set the underline color to white
  },
  button: {
    backgroundColor: 'rgba(34, 35, 64, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    height:'15%',
    width: '70%',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
  suggestionItem: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 1,
      marginVertical: 2,
      width: '90%',
    },
    
    suggestionText: {
      color: 'white',
      fontSize: 12,
    },
    
});
