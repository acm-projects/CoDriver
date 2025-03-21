import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Button, Text, ActivityIndicator} from 'react-native';
import Voice from '@react-native-voice/voice';

// Define the props type
interface SpeechRecognitionProps {
  //onMounted?: () => void; // Optional callback
}

const SpeechRecognition = forwardRef< 
  { startListening: () => void; stopListening: () => void }, // Ref type
  SpeechRecognitionProps // Props type
  >(({ /*onMounted*/ }, ref) => {  
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false); // Add listening state

  useImperativeHandle(ref, () => ({
    startListening: async () => {
      try {
        setIsListening(true); // Indicate listening started
        await Voice.start('en-US');
      } catch (e) {
        console.error("Error starting speech recognition:", e);
        setIsListening(false); // Reset listening state on error
      }
    },
    stopListening: async () => {
      await Voice.stop();
      setIsListening(false); // Indicate listening stopped
    }
  }));

  useEffect(() => {
    
    Voice.onSpeechError = (e) => {
      console.error("Speech error:", e);
      setError(e?.error?.toString() || 'Unknown error');
      setIsListening(false);
    };
    // Notify parent that SpeechRecognition is ready
    //onMounted?.();
    //console.log("Speech results:", e.value); // Log results
    //setResults(e.value || []);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View>
      <Button title="Start Recognizing" onPress={() => Voice.start('en-US')} />
      {isListening && <ActivityIndicator />}
      <Text>Results: {results.join(', ')}</Text>
      {error ? <Text style={{ color: 'red' }}>Error: {error}</Text> : null}
    </View>
  );
});

export default SpeechRecognition;
