import React from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HistoryPage() {
  const router = useRouter();

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
      <View style={styles.container}>
        {/* Header with Wave and Title */}
        <View style={styles.header}>
          {/* Background Overlay for Extra Fill */}
          <View style={styles.backgroundOverlay} />

          {/* Wave Image */}
          <View style={styles.waveContainer}>
            <Image
              source={require('../../assets/images/Vector.png')}
              style={styles.waveImage}
            />
          </View>

          {/* Title with white text */}
          <View style={styles.titleContainer}>
            <Text style={styles.waveTitle}>History</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
        {trips.map((trip, index) => (
          <TouchableOpacity
            key={index}
            style={styles.btn}
            onPress={() => router.push(`../conversation?tripTitle=${encodeURIComponent(trip.name)}`)}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    position: 'relative',
  },
  header: {
    position: 'relative',
    height: 180,
    width: '100%',
    marginBottom: -80,
  },
  /* New Background Overlay */
  backgroundOverlay: {
    position: 'absolute',
    top: -100,
    right: -20,
    width: '200%',
    height: 60, // Adjust height for extra fill
    backgroundColor: '#E17636', // Match background color or use a different fill color
  },
  waveContainer: {
    position: 'absolute',
    top: 40,
    left: -50, // Compensate for container padding
    right: -30,
    height: '100%',
    width: '150%',
    paddingTop: 0
  },
  waveImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'cover',
    marginTop: -90
  },
  titleContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure text is above the wave
    alignItems: 'center',
  },
  waveTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF', // Plain white text
    textAlign: 'center',
    marginTop: -70
  },
  historyContainer: {
    marginTop: 10,
  },
  btn: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
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
    marginLeft: 20,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#B4B4B4',
    marginRight: 15,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#B4B4B4',
    marginRight: 15,
  },
  formAction: {
    marginTop: 20,
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
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});


