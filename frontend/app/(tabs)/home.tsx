import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet } from "react-native";
import axios from "axios";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { Animated, Easing } from 'react-native';
import * as Speech from 'expo-speech';

interface WebSocketEvent {
  data: string;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultEvent {
  results: {
    transcript?: string;
  }[];
}

export default function HomeScreen() {
  const [speechQueue, setSpeechQueue] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null); // WebSocket reference with proper type
  const [recognizing, setRecognizing] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [backendResponse, setBackendResponse] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if TTS is active

  const processSpeechQueue = () => {
    if (speechQueue.length === 0) return;

    // Get the next item from the queue
    const textToSpeak = speechQueue[0];

    // Always stop listening before speaking
    stopListening();

    // Set speaking state
    setIsSpeaking(true);

    // Speak the text
    Speech.speak(textToSpeak, {
      rate: 0.8,
      pitch: 1.0,
      language: "en-US",
      onDone: () => {
        // Update queue by removing the item we just processed
        setSpeechQueue(prevQueue => prevQueue.slice(1));
        setIsSpeaking(false);

        // If queue is now empty, restart listening
        if (speechQueue.length <= 1) {
          setTimeout(() => {
            startListening();
          }, 300);
        }
      },
      onStopped: () => {
        // Update queue by removing the item we just processed
        setSpeechQueue(prevQueue => prevQueue.slice(1));
        setIsSpeaking(false);

        // If queue is now empty, restart listening
        if (speechQueue.length <= 1) {
          setTimeout(() => {
            startListening();
          }, 300);
        }
      },
      onError: (error) => {
        console.error("Speech error:", error);
        // Update queue by removing the item we just processed
        setSpeechQueue(prevQueue => prevQueue.slice(1));
        setIsSpeaking(false);

        // If queue is now empty, restart listening
        if (speechQueue.length <= 1) {
          setTimeout(() => {
            startListening();
          }, 300);
        }
      }
    });
  };

  useEffect(() => {
    // Only process the queue if we're not currently speaking and there are items in the queue
    if (!isSpeaking && speechQueue.length > 0) {
      processSpeechQueue();
    }
  }, [isSpeaking, speechQueue]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event: WebSocketEvent) => {
      console.log("WebSocket message received:", event.data);

      try {
        // Parse the message data
        const parsedData = JSON.parse(event.data);
        console.log("Parsed WebSocket data:", parsedData);

        let textToSpeak = "";

        // Check message type and extract the appropriate text to speak
        if (parsedData.type === "instruction") {
          console.log("Instruction received:", parsedData.data);
          textToSpeak = parsedData.data.instruction || "";
        }
        else if (parsedData.type === "approachingTurn") {
          console.log("Approaching turn:", parsedData.data);
          // Extract relevant info from approaching turn data
          textToSpeak = parsedData.data.instruction || "";
        }
        else if (parsedData.type === "complete") {
          console.log("Navigation complete:", parsedData.data);
          textToSpeak = parsedData.data.message || "You have reached your destination";
        }

        // Update the UI with the extracted text
        setBackendResponse(textToSpeak || JSON.stringify(parsedData));

        // Instead of speaking immediately, add the text to the speech queue
        if (textToSpeak) {
          setSpeechQueue(prevQueue => [...prevQueue, textToSpeak]);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        setBackendResponse(event.data); // Fallback to raw data
      }
    };

    ws.current.onerror = (error: Event) => {
      console.error("WebSocket Error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Check permissions on component mount
  useEffect(() => {
    checkPermissions();
    startListening();
  }, []);

  // Handler for text-to-speech with muting - REMOVED
  // Since we now handle text-to-speech directly in the WebSocket onmessage handler

  const handleTextToSpeech = () => {
    const thingToSay = transcript;
    Speech.speak(thingToSay);
  };

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
  useSpeechRecognitionEvent("result", (event: SpeechRecognitionResultEvent) => {
    const speechResult = event.results[0]?.transcript || "";
    setTranscript(speechResult);
    console.log("Speech to Text Result:", speechResult);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ userInput: speechResult }));
      console.log("Sent to WebSocket:", speechResult);
    }
  });
  useSpeechRecognitionEvent("error", (event: SpeechRecognitionErrorEvent) => {
    console.log("Error:", event.error, "Message:", event.message);
  });

  const startListening = async () => {
    // Don't start listening if TTS is active
    if (isSpeaking) return;

    if (!hasPermission) {
      await requestPermissions();
    }
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: true,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: [
        "weather",
        "temperature",
        "city",
        "weather in",
        "ai",
        "chat",
        "conversation",
        "start navigation",
        "navigate to",
        "take me to",
        "directions to",
        "how do I get to",
        "route to"
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

  // Function to send the transcript to the backend
  const sendSpeechToBackend = async () => {
    if (!transcript) return;

    try {
      setLoading(true);

      // Check if transcript contains navigation keywords
      const navigationKeywords = ["start navigation", "navigate to", "take me to", "directions to", "how do I get to", "route to"];
      const isNavigationRequest = navigationKeywords.some(keyword =>
        transcript.toLowerCase().includes(keyword)
      );

      // Extract destination from the transcript
      let destination = "";
      if (isNavigationRequest) {
        // Parse to extract destination
        for (const keyword of navigationKeywords) {
          if (transcript.toLowerCase().includes(keyword)) {
            destination = transcript.toLowerCase().split(keyword)[1].trim();
            break;
          }
        }
      }

      // If not currently speaking
      if (!isSpeaking) {
        // Choose the appropriate endpoint based on the command type
        if (isNavigationRequest && destination) {
          // Get current location (in a real app, you'd use geolocation)
          // For this example, we'll use a hardcoded origin
          const origin = "2800 Waterview Pkwy, Richardson, TX 75080"; // Default origin
          const destination = "2831 W 15th St Ste 200, Plano, Tx 75075"
          console.log(`Starting navigation to: ${destination}`);

          // Call navigation-specific endpoint
          const response = await axios.post('http://localhost:8000/startSimulationDirections', {
            destination: destination
          });

          console.log("Navigation started:", response.data);
          setBackendResponse(`Starting navigation to ${destination}`);
        } else {
          // Use the general command endpoint for other requests
          const response = await axios.post('http://localhost:8000/command', {
            userInput: transcript,
            sessionId: 'unique-session-id',
          });

          console.log("Backend response:", response.data);

          if (response.data && response.data.response) {
            setBackendResponse(response.data.response);
          } else {
            setBackendResponse("No response received");
          }
        }
      }
    } catch (error) {
      console.error("Error sending speech to backend:", error);
      setBackendResponse("Sorry, there was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  // Modified useEffect with debouncing to prevent multiple API calls
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    if (transcript && !isSpeaking) {
      // Clear any existing timer
      if (debounceTimer) clearTimeout(debounceTimer);

      // Set a new timer
      debounceTimer = setTimeout(() => {
        sendSpeechToBackend();
      }, 1000); // 1 second delay to stabilize transcript
    }

    // Cleanup function
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
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