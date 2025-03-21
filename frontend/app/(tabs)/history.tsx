import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryPage() {
  const router = useRouter();
  const navigation = useNavigation();

  const trips = [
    { name: 'Trip 1', date: '03/01/2025', time: '12:30 PM' },
    { name: 'Trip 2', date: '03/02/2025', time: '2:00 PM' },
    { name: 'Trip 3', date: '03/03/2025', time: '5:15 PM' },
    { name: 'Trip 4', date: '03/04/2025', time: '8:45 AM' },
    { name: 'Trip 5', date: '03/05/2025', time: '3:00 PM' },
    { name: 'Trip 6', date: '03/06/2025', time: '10:00 AM' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Ionicons name="time-outline" size={32} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>History</Text>
        </View>
      </View>

      <View style={styles.historyContainer}>
        {trips.map((trip, index) => (
          <TouchableOpacity
            key={index}
            style={styles.btn}
            onPress={() => router.push(`/conversation?tripTitle=${encodeURIComponent(trip.name)}`)}
          >
            <View style={styles.tripContainer}>
              <Text style={styles.btnText}>{trip.name}</Text>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{trip.date}</Text>
                <Text style={styles.timeText}>{trip.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formAction}>
        <TouchableOpacity onPress={() => console.log('Companion Chat History pressed')}>
          <View style={styles.companionBtn}>
            <Text style={styles.companionBtnText}>Companion Chat History</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#E17636',
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  historyContainer: {
    padding: 20,
  },
  btn: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#3D3D3D',
    flexDirection: 'row',
    width: '100%',
  },
  tripContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#B4B4B4',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#B4B4B4',
  },
  formAction: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  companionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#1E1E1E',
    borderColor: '#ffffff',
    marginTop: 10,
  },
  companionBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
