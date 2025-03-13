import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';

export default function HomeScreen() {
  // State to control the visibility of the pop-up modal
  //const [modalVisible, setModalVisible] = useState(true);

  return (
    <View style={styles.container}>
      {/* Top-left section with logo and app name */}
      <View style={styles.topLeftContainer}>
        <Image
          source={require('../../assets/images/codriver_logo.png')} // App logo
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.topLeftText}>CoDriver</Text>
      </View>

      <TouchableOpacity style={styles.spotifyTab}>
        {/* Main container to align the content */}
        <View style={styles.leftSection}>
          <Image
            source={require('../../assets/images/album cover.png')}
            style={styles.albumCover}
          />
        </View>

        <View style={styles.rightSection}>
          {/* Text container for song title */}
          <View>
            <Text style={styles.spotifyTabText} numberOfLines={2}>
              The Color Violet · Tory Lanez
            </Text>

            {/* Bluetooth icon + BeatSpill+ in a row */}
            <View style={styles.beatspillContainer}>
              <Image
                source={require('../../assets/images/bluetooth.png')}
                style={styles.bluetooth}
              />
              <Text style={styles.bluetoothText}>iPhone 16</Text>
            </View>
          </View>

          {/* Second Bluetooth icon */}
          <Image
            source={require('../../assets/images/bluetooth.png')}
            style={styles.bluetooth2}
          />
        </View>

        <View style={styles.bottomSection}>
          <Image
            source={require('../../assets/images/progress_bar.png')}
            style={styles.progressBar}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bottomSection}>
          <Image
            source={require('../../assets/images/progress_bar.png')}
            style={styles.progressBar2}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Background AI-themed blob image */}
        <Image
          source={require('../../assets/images/AI_Blob.png')}
          style={styles.blobImage}
          resizeMode="contain"
        />

        {/* Text on top of the image */}
        <Text style={styles.overlayText}>Say “Hey [CoDriver]” to start</Text>
      </View>



      {/* Destination Button at the bottom */}
      <TouchableOpacity style={styles.destinationButton}>
        {/* Left Section: Icon */}
        <View style={styles.leftSection2}>
          <Image
            source={require('../../assets/images/Search.png')}
            style={styles.SearchIcon}
          />
        </View>

        {/* Right Section: Text + Icon */}
        <View style={styles.rightSection2}>
          <Text style={styles.destinationTabText} numberOfLines={1}>
            Where are you heading?
          </Text>
          <Image
            source={require('../../assets/images/Voice 2.png')}
            style={styles.Voice2}
          />
        </View>
      </TouchableOpacity>


    </View>
  );
}

// Styles for the UI components
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
    width: 670,
    height: 630,
    marginTop: -680,
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
  spotifyTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: -20, // Keeps original padding
    borderWidth: 1,
    backgroundColor: '#2D2A38',
    borderColor: '#2D2A38',
    marginTop: 706,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: -10,
    zIndex: 10
  },
  spotifyTabText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#AE9A8C',
    flexShrink: 1, // Ensures text doesn't wrap
    textAlign: 'center', // Keeps text aligned within the button
    paddingLeft: -100
  },
  destinationTabText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#AE9A8C',
    flexShrink: 1, // Ensures text doesn't wrap
    textAlign: 'center', // Keeps text aligned within the button
  },
  albumCover: {
    width: 60,  // Adjust width as needed
    height: 60, // Adjust height as needed
    marginRight: 10,
    marginLeft: 20,
    borderRadius: 5, // Optional: for rounded corners
  },
  SearchIcon: {
    width: 30,  // Adjust width as needed
    height: 30, // Adjust height as needed
    marginRight: 10,  // Space between the icon and the text
  },
  bluetooth: {
    width: 30,  // Adjust width as needed
    height: 30, // Adjust height as needed
    marginRight: 50,
    marginLeft: -15,
    borderRadius: 5, // Optional: for rounded corners
    paddingLeft: 15,
    paddingRight: 0
  },
  leftSection: {
    flexDirection: 'column', // Align album cover vertically in the left section
    justifyContent: 'center', // Center the content vertically in the left section
    marginRight: 10, // Space between the album cover and the text
  },
  leftSection2: {
    flexDirection: 'row',  // Align icon horizontally in the left section
    justifyContent: 'center',
    alignItems: 'center', // Center the icon vertically
  },

  rightSection2: {
    flexDirection: 'row',  // Align text and icon horizontally in the right section
    justifyContent: 'center',
    alignItems: 'center', // Center them vertically
  },
  rightSection: {
    flexDirection: 'row',  // Arrange items horizontally
    justifyContent: 'center',
    alignItems: 'center', // Align items vertically in the center
  },
  bluetooth2: {
    width: 40,  // Increase the size of the Bluetooth icon
    height: 40, // Increase the size of the Bluetooth icon
    marginLeft: 10, // Adjust spacing between the icons
    borderRadius: 5, // Optional: for rounded corners
  },
  Voice2: {
    width: 30,  // Adjust width as needed
    height: 30, // Adjust height as needed
    marginLeft: 10, // Space between the text and the icon
  },
  bluetoothText: {
    fontSize: 16,
    color: '#AE9A8C',
    textAlign: 'left',
    marginTop: 2, // Keeps slight spacing between song text and BeatSpill
    marginLeft: -40, // Moves text closer to Bluetooth 1 logo
  },
  beatspillContainer: {
    flexDirection: 'row',  // Align Bluetooth and text in a row
    alignItems: 'center',  // Center them vertically
    marginTop: 2,          // Small spacing below song title
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0, // Adjust as needed
    left: 20,  // Align to the left
    width: '80%', // Adjust width as needed
    flexDirection: 'column', // Stack the bars vertically
    alignItems: 'flex-start',  // Align the progress bars to the left
  },
  progressBar: {
    width: '90%', // Adjust width of the first progress bar
    height: 7,  // Adjust height as needed
    marginLeft: -2
  },
  progressBar2: {
    width: '118%',  // Adjust width of the second progress bar
    height: 7,  // Adjust height as needed
    opacity: 0.6,  // Lighter shade by reducing opacity
    tintColor: 'lightgray', // Lighter color shade
  },
  /*overlayText: {
    position: 'absolute', 
    top: '50%',           
    left: '50%',          
    transform: [
      { translateX: -50 },  
      { translateY: -50 },  
    ],
    fontSize: 20,          
    color: 'white',        
    fontWeight: 'bold',    
    textAlign: 'center',   
    width: '100%',
    marginLeft: -195,
    marginRight: -190,
    marginTop: -375,
    marginBottom: 375         
  }, */
  
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  googleBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  // New Destination Button Styles
  destinationButton: {
    position: 'absolute',
    bottom: 630,
    transform: [{ translateX: -50 }],
    backgroundColor: '#2D2A38', // Button color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row', // Align items horizontally
    //justifyContent: 'space-between', // Space between left and right sections
    marginBottom: 80,
    marginRight: 120,
    marginLeft: 90,
  },
  destinationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    position: 'absolute',
    width: 20, // Adjust the width as needed
    height: 20, // Adjust the height as needed
  },
  left: {
    //marginLeft: 50,
    marginRight: 200,
    //top: '50%', // Vertically centered
    //transform: [{ translateY: -10 }], // Adjust for proper vertical alignment
  },
  right: {
    right: -20, // Adjust position to the right
    top: '50%', // Vertically centered
    transform: [{ translateY: -10 }], // Adjust for proper vertical alignment
  },
  bottom: {
    bottom: -20, // Adjust position to the bottom
    left: '50%', // Horizontally centered
    transform: [{ translateX: -10 }], // Adjust for proper horizontal alignment
  },
});