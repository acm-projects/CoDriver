import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Button, Text } from 'react-native';
import Voice from '@react-native-voice/voice';

// Define the props type
interface SpeechRecognitionProps {
  onMounted?: () => void; // Optional callback
}

const SpeechRecognition = forwardRef< 
  { startListening: () => void; stopListening: () => void }, // Ref type
  SpeechRecognitionProps // Props type
  >(({ onMounted }, ref) => {  
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    startListening: async () => {
      try {
        await Voice.start('en-US');
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    },
    stopListening: async () => {
      await Voice.stop();
    }
  }));

  useEffect(() => {
    Voice.onSpeechResults = (e) => setResults(e.value || []);
    Voice.onSpeechError = (e) => setError(e?.error?.toString() || 'Unknown error');

    // Notify parent that SpeechRecognition is ready
    onMounted?.();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View>
      <Button title="Start Recognizing" onPress={() => Voice.start('en-US')} />
      <Text>Results: {results.join(', ')}</Text>
      {error ? <Text style={{ color: 'red' }}>Error: {error}</Text> : null}
    </View>
  );
});

export default SpeechRecognition;
