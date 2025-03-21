// app/conversation.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const mockConversation = [
  { id: '1', sender: 'Me', message: 'Hey CoDriver!' },
  { id: '2', sender: 'CoDriver', message: 'Hi there! Where are you headed today?' },
  { id: '3', sender: 'Me', message: 'I am headed to UT Dallas.' },
  { id: '4', sender: 'CoDriver', message: 'Awesome! You are headed to college as your daily routine from Mondays to Thursdays. Is that correct?' },
  { id: '5', sender: 'Me', message: 'Yes I am!' },
  { id: '6', sender: 'CoDriver', message: 'Anything special happening on campus for you or in general today?' },
  { id: '7', sender: 'Me', message: 'Yep! I have a soccer tournament tonight and I am going to a small party with friends.' },
  { id: '8', sender: 'CoDriver', message: 'That is amazing! Do you have a favorite soccer player? And what kind of party is it?' },
];

const ChatDetailScreen = () => {
  const { tripTitle } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tripTitle}</Text>
      <FlatList
        data={mockConversation}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.sender === 'CoDriver' ? styles.humanMessage : styles.aiMessage}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 16, marginTop: 50 },
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
  sender: { fontWeight: 'bold', color: '#aaa' },
  message: { color: '#fff' },
});