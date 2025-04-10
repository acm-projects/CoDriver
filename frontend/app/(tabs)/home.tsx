import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet } from "react-native";
import axios from "axios";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Text, TextInput, TouchableOpacity, Image, Modal } from "react-native";
import { Animated, Easing } from "react-native";
import * as Speech from "expo-speech";
import { useAuth } from '../../context/AuthContext';
import * as Network from 'expo-network';

// Define interfaces for WebSocket messages
interface InstructionMessage {
  type: string;
  data: {
    instruction?: string;
    message?: string;
  };
}

// Define WebSocket type to address WebSocket errors
type WebSocketType = WebSocket | null;

export default function HomeScreen() {
  const { token } = useAuth();
  const ws = useRef<WebSocketType>(null);
  const [recognizing, setRecognizing] = useState(true); // Start with true to unmute
  const [transcript, setTranscript] = useState("");
  const [backendResponse, setBackendResponse] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [destination, setDestination] = useState("");
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState('');

  const handleInputChange = (text: string) => {
    setDestination(text); // Update destination state when user types
  };

  const handleSubmitDestination = async () => {
    if (destination.trim()) {
      try {
        const tripData = await startTrip(destination);
        startNavigation(destination);
      } catch (error) {
        console.error('Error starting trip:', error);
      }
    }
  };

  // WebSocket setup
  useEffect(() => {
    ws.current = new WebSocket(`ws://${ipAddress}:8000/`);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event: WebSocketMessageEvent) => {
      try {
        const parsedData = JSON.parse(event.data as string) as InstructionMessage;
        let textToSpeak = "";

        if (parsedData.type === "approachingTurn") {
          textToSpeak = parsedData.data.instruction || "";
        } else if (parsedData.type === "complete") {
          textToSpeak = parsedData.data.message || "You have reached your destination";
        }

        if (textToSpeak) {
          stopListening(); // Stop STT before speaking
          setBackendResponse(textToSpeak);
          speakResponse(textToSpeak); // Centralized speaking function
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        setBackendResponse(String(event.data));
      }
    };

    ws.current.onerror = (ev: Event) => {
      console.error("WebSocket Error:", ev);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Centralized function to handle speaking
  const speakResponse = (text: string) => {
    if (recognizing) stopListening(); // Ensure STT is off
    setIsSpeaking(true);

    Speech.speak(text, {
      rate: 0.8,
      pitch: 1.0,
      language: "en-US",
      onStart: () => setIsSpeaking(true),
      onDone: () => {
        setIsSpeaking(false);
        setTimeout(startListening, 1500); // Delay restart of STT
      },
      onStopped: () => {
        setIsSpeaking(false);
        setTimeout(startListening, 1500);
      },
      onError: () => {
        setIsSpeaking(false);
        setTimeout(startListening, 1500);
      },
    });
  };

  // Check permissions and initialize listening
  useEffect(() => {
    const initialize = async () => {
      await checkPermissions();
      if (hasPermission) {
        startListening(); // Start listening immediately if permissions are granted
      } else {
        await requestPermissions();
        if (hasPermission) startListening(); // Start after requesting permissions
      }
    };
    initialize();
  }, []);

  const checkPermissions = async () => {
    const { status, granted } = await ExpoSpeechRecognitionModule.getPermissionsAsync();
    console.log("Permissions Status:", status);
    console.log("Granted:", granted);
    setHasPermission(granted);
  };

  const requestPermissions = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    setHasPermission(true);
  };

  // Event listeners for speech recognition
  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    const speechResult = event.results[0]?.transcript || "";
    setTranscript(speechResult);
    console.log("Speech to Text Result:", speechResult);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Error:", event.error, "Message:", event.message);
  });

  const startListening = async () => {
    if (isSpeaking || !hasPermission) return; // Prevent starting if speaking

    await requestPermissions();
    if (!hasPermission) return;

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: true,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: [
        "weather", "temperature", "city", "weather in", "ai", "chat", "conversation",
        "start navigation", "navigate to", "take me to", "directions to",
        "how do I get to", "route to"
      ],
    });
    setRecognizing(true);
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setRecognizing(false);
  };

  const toggleMute = () => {
    if (recognizing) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Get IP Address for API calls
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (error) {
        console.error('Failed to get IP address:', error);
      }
    };
    getIpAddress();
  }, []);

  // Navigation function
  const startNavigation = async (dest: string) => {
    try {
      setLoading(true);
      const destination = dest || "2831 W 15th St Ste 200, Plano, Tx 75075";
      console.log(`Starting navigation to: ${destination}`);

      const response = await axios.post(`http://${ipAddress}:8000/startSimulationDirections`, {
        destination,
        origin: "2800 Waterview Pkwy, Richardson, Tx 75080"
      });

      console.log("Navigation started:", response.data);
      setBackendResponse(`Starting navigation to ${destination}`);
      speakResponse(`Starting navigation to ${destination}`);
    } catch (error) {
      console.error("Error starting navigation:", error);
      setBackendResponse("Sorry, there was an error starting navigation.");
      speakResponse("Sorry, there was an error starting navigation.");
    } finally {
      setLoading(false);
    }
  };

  // Start a new trip
  const startTrip = async (destination: string) => {
    if (!token || !ipAddress) {
      console.error('No authentication token or IP address found');
      return;
    }

    try {
      const response = await axios.post(`http://${ipAddress}:8000/api/history/start-trip`, 
        { destination },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.tripId) {
        setCurrentTripId(response.data.tripId);
        return response.data;
      }
    } catch (error) {
      console.error('Error starting trip:', error);
      throw error;
    }
  };

  // Add conversation to current trip
  const addConversation = async (userMessage: string, aiResponse: string) => {
    if (!token || !currentTripId || !ipAddress) {
      console.error('Missing required data for adding conversation');
      return;
    }

    try {
      await axios.post(`http://${ipAddress}:8000/api/history/trip/${currentTripId}/conversations`,
        { userMessage, aiResponse },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
    } catch (error) {
      console.error('Error adding conversation:', error);
    }
  };

  // End current trip
  const endTrip = async () => {
    if (!token || !currentTripId || !ipAddress) {
      console.error('Missing required data for ending trip');
      return;
    }

    try {
      await axios.post(`http://${ipAddress}:8000/api/history/trip/${currentTripId}/end`,
        {},  // empty body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setCurrentTripId(null);
    } catch (error) {
      console.error('Error ending trip:', error);
    }
  };

  // Extract destination from user speech
  const extractDestination = (transcript: string): string | null => {
    console.log('Processing transcript:', transcript); // Debug log
  
    const navigationKeywords = [
      "start navigation", "navigate to", "take me to", "directions to",
      "how do I get to", "route to"
    ];
  
    for (const keyword of navigationKeywords) {
      if (transcript.toLowerCase().includes(keyword)) {
        const afterKeyword = transcript.toLowerCase().split(keyword)[1]?.trim();
        console.log('Found keyword:', keyword, 'Extracted:', afterKeyword); // Debug log
        if (afterKeyword) {
          return afterKeyword;
        }
      }
    }
    return null;
  };

  // Create a separate function to check for end trip commands
  const isEndTripCommand = (text: string): boolean => {
    const endTripKeywords = [
      "end trip",
      "stop navigation",
      "end navigation",
      "stop trip",
      "cancel trip",
      "cancel navigation",
      "finish trip",
      "finish navigation",
      "end journey",
      "stop journey",
      "we're here",
      "we have arrived",
      "i've arrived",
      "i have arrived",
      "that's all",
      "we're done",
      "i'm done",
      "end route",
      "stop route"
    ];

    return endTripKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Modified sendSpeechToBackend to handle trip-related commands
  const sendSpeechToBackend = async () => {
    if (!transcript || isSpeaking) return;

    try {
      setLoading(true);

      
      // Check if this is a navigation request
      const extractedDestination = extractDestination(transcript);
      console.log('Extracted destination:', extractedDestination);
      
      if (extractedDestination) {
        console.log('Attempting to start trip to:', extractedDestination);
        try {
          const tripData = await startTrip(extractedDestination);
          console.log('Trip started successfully:', tripData);
          // Call startNavigation after successfully starting the trip
          await startNavigation("2831 W 15th St Ste 200, Plano, Tx 75075");
        } catch (tripError) {
          console.error('Failed to start trip:', tripError);
          setBackendResponse("Sorry, I couldn't start the trip. Please try again.");
          speakResponse("Sorry, I couldn't start the trip. Please try again.");
        }
      } else if (isEndTripCommand(transcript)) {
        if (!currentTripId) {
          setBackendResponse("There is no active trip to end.");
          speakResponse("There is no active trip to end.");
          return;
        }
        await endTrip();
        setBackendResponse("Trip ended successfully");
        speakResponse("Trip ended successfully");
      } else {
        // Regular conversation
        const response = await axios.post("http://localhost:8000/command", {
          userInput: transcript,
          sessionId: "unique-session-id",
        });
        
        const responseText = response.data.response || "No response received";
        setBackendResponse(responseText);
        
        // Store the conversation if we're in an active trip
        if (currentTripId) {
          await addConversation(transcript, responseText);
        }
        
        speakResponse(responseText);
      }
    } catch (error) {
      console.error("Error processing speech:", error);
      if (axios.isAxiosError(error)) {
        console.error('Full error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      }
      setBackendResponse("Sorry, there was an error processing your request.");
      speakResponse("Sorry, there was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced transcript processing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (transcript && !isSpeaking) sendSpeechToBackend();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [transcript]);

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
     </View>


     {/* Destination Button at the bottom */}
     <TouchableOpacity style={styles.destinationButton} onPress={handleSubmitDestination}>
       {/* Left Section: Icon */}
       <View style={styles.leftSection2}>
         <Image
           source={require('../../assets/images/Search.png')}
           style={styles.SearchIcon}
         />
       </View>


       {/* Right Section: Text Input */}
       <View style={styles.rightSection2}>
         <TextInput
           style={styles.destinationInput}
           placeholder="Where are you heading?"
           placeholderTextColor="#AE9A8C"
           value={destination}
           onChangeText={handleInputChange} // Update state on text change
         />
         <Image
           source={require('../../assets/images/Voice 2.png')}
           style={styles.Voice2}
         />
       </View>
     </TouchableOpacity>


     <TouchableOpacity
       style={styles.muteButton} // Style for the mute button
       onPress={toggleMute}
     >
       <View style={styles.leftSection3}>
       </View>
       <View style={styles.rightSection3}>
         <Text style={styles.destinationTabText2} numberOfLines={1}>
           {recognizing ? "Mute" : "Unmute"}
         </Text>
       </View>
     </TouchableOpacity>
   </View>
 );
}


const styles = StyleSheet.create({
 destinationInput: {
   flex: 1,
   fontSize: 18,
   color: '#AE9A8C',
   paddingVertical: 10,
   paddingHorizontal: 10,
   backgroundColor: 'rgba(0, 0, 0, 0)', // Slightly transparent background
   borderRadius: 20,
   marginLeft: -10, // Space between the icon and input
   width: '30%'
 },
 muteButton: {
   position: 'absolute',
   bottom: 40,
   backgroundColor: '#2D2A38',
   paddingVertical: 12,
   borderRadius: 30,
   width: '40%',
   alignItems: 'center',
   justifyContent: 'center', // Ensure content is centered
   marginBottom: 80,
   marginRight: 120,
   marginLeft: 120,
 },


 destinationTabText2: {
   fontSize: 18,
   fontWeight: '600',
   color: '#AE9A8C',
   textAlign: 'center', // Center text inside the button
   width: '110%', // Ensure text takes full width to remain centered
 },




 leftSection3: {
   flexDirection: 'row',  // Align icon horizontally in the left section
   justifyContent: 'center',
   alignItems: 'center', // Center the icon vertically
 },
 rightSection3: {
   flexDirection: 'row',  // Align text and icon horizontally in the right section
   justifyContent: 'center',
   alignItems: 'center', // Center them vertically
   marginLeft: 20
 },
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
   width: '87%'
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
   bottom: 530,
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

