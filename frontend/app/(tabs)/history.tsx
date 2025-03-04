import { View, Text, StyleSheet } from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.background}> {/* Apply the background style here */}
          <View style={styles.contentContainer}> {/* Optional: Add a content container */}
            <Text style={styles.text}>History Page</Text>
          </View>
        </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'black',
    flex: 1, 
  },
  contentContainer: { 
    padding: 20,
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
  },
  text: {
    color: 'white',
    fontSize: 20, 
  },
});
