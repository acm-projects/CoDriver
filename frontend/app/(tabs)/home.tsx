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
  const [weatherResponse, setWeatherResponse] = useState("");

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
      contextualStrings: ["weather", "temperature", "city", "weather in"],
    });
  };

  // Extract city name from transcript (improve this as needed)
  const extractCityFromTranscript = (transcript: string): string | null => {
    const regex = /weather in (\w+)/i; // Example: "weather in Dallas"
    const match = transcript.match(regex);
    return match ? match[1] : null; // Return the city name if found
  };

  // Send speech to backend (WeatherController)
  const sendSpeechToBackend = async () => {
    if (!transcript) return;

    const city = extractCityFromTranscript(transcript);
    if (!city) {
      console.warn("No valid city found in transcript.");
      return;
    }

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
      setWeatherResponse(data.weather || "No weather response.");
    } catch (error) {
      console.error("Error sending speech to backend:", error);
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
      <Text style={styles.header}>Weather Info via Speech Recognition</Text>

      {!recognizing ? (
        <Button title="Start Listening" onPress={handleStart} />
      ) : (
        <Button title="Stop Listening" onPress={() => ExpoSpeechRecognitionModule.stop()} />
      )}

      <ScrollView style={styles.transcriptBox}>
        <Text style={styles.transcript}>
          {transcript || "Say a city name..."}
        </Text>
      </ScrollView>

      {weatherResponse && (
        <ScrollView style={styles.responseBox}>
          <Text style={styles.response}>{weatherResponse}</Text>
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
