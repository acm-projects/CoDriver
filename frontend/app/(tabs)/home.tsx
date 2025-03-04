import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true); // Controls pop-up visibility


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
    width: 470,
    height: 430,
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
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
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
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});



