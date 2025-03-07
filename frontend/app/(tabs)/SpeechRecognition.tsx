import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import Voice from '@react-native-voice/voice';

const SpeechRecognition: React.FC = () => {
  const [recognized, setRecognized] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);

  useEffect(() => {
    Voice.onSpeechStart = () => setRecognized('Listening...');
    Voice.onSpeechRecognized = () => setRecognized('Recognized');
    Voice.onSpeechEnd = () => setRecognized('Speech Ended');
    Voice.onSpeechError = (e) => setError(e?.error?.toString() || 'Unknown error');
    Voice.onSpeechResults = (e) => setResults(e.value || []);
    Voice.onSpeechPartialResults = (e) => setPartialResults(e.value || []);
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  
  

  const startRecognizing = async () => {
    setRecognized('');
    setError('');
    setResults([]);
    setPartialResults([]);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    await Voice.stop();
  };

  return (
    <View>
      <Button title="Start Recognizing" onPress={startRecognizing} />
      <Button title="Stop Recognizing" onPress={stopRecognizing} />
      <Text>Results: {results.join(', ')}</Text>
      <Text>Partial: {partialResults.join(', ')}</Text>
      {error ? <Text style={{ color: 'red' }}>Error: {error}</Text> : null}
    </View>
  );
};

export default SpeechRecognition;
