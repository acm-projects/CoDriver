import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export default function HomeScreen() {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [response, setResponse] = useState(""); // For both AI and Weather responses

  // Check permissions on component mount
  useEffect(() => {
    checkPermissions();
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
    setTranscript(event.results[0]?.transcript || "");
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Error:", event.error, "Message:", event.message);
  });

  const handleStart = async () => {
    if (!hasPermission) {
      await requestPermissions();
    }
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: ["weather", "temperature", "city", "weather in", "ai", "chat", "conversation"],
    });
  };

  // Function to extract city from transcript
  const extractCityFromTranscript = (transcript: string): string | null => {
    const regex = /weather in (\w+)/i; // Example: "weather in Dallas"
    const match = transcript.match(regex);
    return match ? match[1] : null; // Return the city name if found
  };

  // Function to send the transcript to the appropriate backend
  const sendSpeechToBackend = async () => {
    if (!transcript) return;

    // Check if the transcript is a weather query (contains "weather in")
    const city = extractCityFromTranscript(transcript);

    if (city) {
      // If city found, send the weather request to the backend
      try {
        const response = await fetch("http://10.0.0.215:8000/weather", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: city, // Send only the city name
          }),
        });

        const data = await response.json();
        console.log("Weather Response:", data);
        setResponse(data.weather || "No weather response.");
      } catch (error) {
        console.error("Error sending speech to backend:", error);
      }
    } else {
      // Otherwise, treat it as a general AI conversation
      try {
        const response = await fetch("http://10.0.0.215:8000/conversation", {  // Replace with your actual IP address
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInput: transcript, // Send the full transcript as user input
          }),
        });

        const data = await response.json();
        console.log("AI Response:", data);
        setResponse(data.aiResponse || "No response from AI.");
      } catch (error) {
        console.error("Error sending speech to AI:", error);
      }
    }
  };

  // Call sendSpeechToBackend when speech recognition stops
  useEffect(() => {
    if (!recognizing && transcript) {
      sendSpeechToBackend();
    }
  }, [recognizing]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Input for Weather and AI</Text>

      {!recognizing ? (
        <Button title="Start Listening" onPress={handleStart} />
      ) : (
        <Button title="Stop Listening" onPress={() => ExpoSpeechRecognitionModule.stop()} />
      )}

      <ScrollView style={styles.transcriptBox}>
        <Text style={styles.transcript}>
          {transcript || "Say something to chat with AI or ask for weather..."}
        </Text>
      </ScrollView>

      {response && (
        <ScrollView style={styles.responseBox}>
          <Text style={styles.response}>{response}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    marginTop: 50,
  },
  transcriptBox: {
    marginTop: 20,
    padding: 10,
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 10,
  },
  transcript: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  responseBox: {
    marginTop: 20,
    padding: 10,
    width: "100%",
    backgroundColor: "#444",
    borderRadius: 10,
  },
  response: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});
