import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal, PermissionsAndroid } from 'react-native';
import SpeechRecognition from '../SpeechRecognition';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [showSpeechRecognition, setShowSpeechRecognition] = useState(false);
  const [isSpeechMounted, setIsSpeechMounted] = useState(false);
  const speechRef = useRef<{ startListening: () => void; stopListening: () => void } | null>(null);

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "We need access to your microphone for speech recognition.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Deny",
            buttonPositive: "Allow",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Microphone permission denied");
        } else {
          console.log("Microphone permission granted");
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestMicrophonePermission();
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    setShowSpeechRecognition(true);
  };

  useEffect(() => {
    if (isSpeechMounted && speechRef.current) {
      speechRef.current.startListening();
    }
    else if (showSpeechRecognition && !speechRef.current){
      console.log("speechRef.current is null");
    }
  }, [showSpeechRecognition, speechRef.current]);

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

      <Image
        source={require('../../assets/images/AI_Blob.png')}
        style={styles.blobImage}
        resizeMode="contain"
      />

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

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>I'm feeling lucky!</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Start Voice Recognition</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showSpeechRecognition && (
        <SpeechRecognition ref={speechRef} /*onMounted={() => setIsSpeechMounted(true)}*/ />
      )}
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
    width: 40,
    height: 40,
    marginRight: 8,
  },
  topLeftText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  blobImage: {
    position: 'absolute',
    width: 500,
    height: 450,
    top: '25%',
    alignSelf: 'center',
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
});
