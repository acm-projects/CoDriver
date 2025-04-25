// app/conversation.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import * as Network from 'expo-network';

interface Conversation {
  sender: 'user' | 'codriver';
  message: string;
  timestamp: string;
}

const ChatDetailScreen = () => {
  const { tripId } = useLocalSearchParams();
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState('172.20.10.4');



  useEffect(() => {
    const fetchConversations = async () => {
      if (!token || !ipAddress || !tripId) return;

      try {
        const response = await axios.get(
          `http://${ipAddress}:8000/api/history/trip/${tripId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token, ipAddress, tripId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Conversation</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#E17636" style={styles.loader} />
      ) : conversations.length === 0 ? (
        <Text style={styles.noConversationsText}>No conversations found</Text>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={item.sender === 'codriver' ? styles.aiMessage : styles.humanMessage}>
              <Text style={styles.sender}>{item.sender === 'codriver' ? 'CoDriver' : 'Me'}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 16 
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 16, 
    marginTop: 50 
  },
  humanMessage: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  aiMessage: {
    backgroundColor: '#E17636',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  sender: { 
    fontWeight: 'bold', 
    color: '#aaa' 
  },
  message: { 
    color: '#fff' 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConversationsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChatDetailScreen;
