import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';


// TEST FILE FOR THE AI SLIDERS IN THE SETTINGS PAGE 
// will add to main page when i figure out when
// do npm install @react-native-community/slider

interface AISettingsSliderProps {
  userId: string;
  initialSettings?: {
    temperature?: number;
    humorLevel?: number;
    frequency?: number;
  };
  onSettingsChange?: (settings: {
    temperature?: number;
    humorLevel?: number;
    frequency?: number;
  }) => void;
}

const AISettingsSlider: React.FC<AISettingsSliderProps> = ({
  userId,
  initialSettings = {},
  onSettingsChange,
}) => {
  const [temperature, setTemperature] = useState(initialSettings.temperature || 0.8);
  const [humorLevel, setHumorLevel] = useState(initialSettings.humorLevel || 0.5);
  const [frequency, setFrequency] = useState(initialSettings.frequency || 0.5);
  const [humorStyle, setHumorStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // fetch initial settings if not given
  useEffect(() => {
    if (!initialSettings.temperature && !initialSettings.humorLevel && !initialSettings.frequency) {
      fetchAISettings();
    }
  }, []);

  const fetchAISettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:8000/api/ai-settings/${userId}`);
      const { temperature, humorLevel, frequency } = response.data;
      
      setTemperature(temperature || 0.8);
      setHumorLevel(humorLevel || 0.5);
      setFrequency(frequency || 0.5);
      
      if (onSettingsChange) {
        onSettingsChange({ temperature, humorLevel, frequency });
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemperature = async (value: number) => {
    try {
      setIsLoading(true);
      // Round to one decimal place
      const roundedValue = Math.round(value * 10) / 10;
      setTemperature(roundedValue);
      
      await axios.post('http://localhost:8000/changeTemperature', {
        temperature: roundedValue,
        userId,
      });
      
      if (onSettingsChange) {
        onSettingsChange({ temperature: roundedValue });
      }
    } catch (error) {
      console.error('Error updating temperature:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHumorLevel = async (value: number) => {
    try {
      setIsLoading(true);
      // round to one decimal place
      const roundedValue = Math.round(value * 10) / 10;
      setHumorLevel(roundedValue);
      
      const response = await axios.post('http://localhost:8000/setHumorLevel', {
        humorLevel: roundedValue,
        userId,
      });
      
      if (response.data.style) {
        setHumorStyle(response.data.style);
      }
      
      if (onSettingsChange) {
        onSettingsChange({ humorLevel: roundedValue });
      }
    } catch (error) {
      console.error('Error updating humor level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFrequency = async (value: number) => {
    try {
      setIsLoading(true);
      // Round to one decimal place
      const roundedValue = Math.round(value * 10) / 10;
      setFrequency(roundedValue);
      
      await axios.post('http://localhost:8000/setFrequency', {
        frequency: roundedValue,
        userId,
      });
      
      if (onSettingsChange) {
        onSettingsChange({ frequency: roundedValue });
      }
    } catch (error) {
      console.error('Error updating frequency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHumorStyleText = (level: number) => {
    if (level < 0.25) return 'Serious';
    if (level < 0.5) return 'Casual';
    if (level < 0.75) return 'Fun';
    return 'Very Fun';
  };

  const getFrequencyText = (level: number) => {
    if (level < 0.25) return 'Rare';
    if (level < 0.5) return 'Some';
    if (level < 0.75) return 'Often';
    return 'Very Often';
  };

  const getTemperatureText = (level: number) => {
    if (level < 0.3) return 'Focused';
    if (level < 0.6) return 'Balanced';
    if (level < 0.8) return 'Creative';
    return 'Very Creative';
  };

  return (
    <View style={styles.container}>
      {/* Temperature Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Randomness</Text>
          <Text style={styles.sliderValue}>{temperature.toFixed(1)} - {getTemperatureText(temperature)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={temperature}
          onValueChange={updateTemperature}
          minimumTrackTintColor="#FF822F"
          maximumTrackTintColor="#767577"
          thumbTintColor="#FFFFFF"
          disabled={isLoading}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinLabel}>Focused</Text>
          <Text style={styles.sliderMaxLabel}>Creative</Text>
        </View>
      </View>
      
      {/* Humor Level Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Humor</Text>
          <Text style={styles.sliderValue}>{humorLevel.toFixed(1)} - {humorStyle || getHumorStyleText(humorLevel)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={humorLevel}
          onValueChange={updateHumorLevel}
          minimumTrackTintColor="#FF822F"
          maximumTrackTintColor="#767577"
          thumbTintColor="#FFFFFF"
          disabled={isLoading}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinLabel}>Serious</Text>
          <Text style={styles.sliderMaxLabel}>Funny</Text>
        </View>
      </View>
      
      {/* Frequency Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Frequency</Text>
          <Text style={styles.sliderValue}>{frequency.toFixed(1)} - {getFrequencyText(frequency)}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={frequency}
          onValueChange={updateFrequency}
          minimumTrackTintColor="#FF822F"
          maximumTrackTintColor="#767577"
          thumbTintColor="#FFFFFF"
          disabled={isLoading}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderMinLabel}>Rare</Text>
          <Text style={styles.sliderMaxLabel}>Often</Text>
        </View>
      </View>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Ionicons name="sync" size={20} color="#FF822F" />
          <Text style={styles.loadingText}>Updating settings...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F2F2F',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sliderStyle:{
    
  },
  sliderValue: {
    fontSize: 14,
    color: '#FF822F',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderMinLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  sliderMaxLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingText: {
    color: '#FF822F',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default AISettingsSlider; 