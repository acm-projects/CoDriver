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
      contextualStrings: ["CoDriver", "navigation", "music"],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Speech Recognition</Text>

      {!recognizing ? (
        <Button title="Start Listening" onPress={handleStart} />
      ) : (
        <Button title="Stop Listening" onPress={() => ExpoSpeechRecognitionModule.stop()} />
      )}

      <ScrollView style={styles.transcriptBox}>
        <Text style={styles.transcript}>{transcript || "Say something..."}</Text>
      </ScrollView>
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
    marginTop: 50
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
});
