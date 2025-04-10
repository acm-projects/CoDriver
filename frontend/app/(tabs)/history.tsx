import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import * as Network from 'expo-network';

interface Trip {
  id: string;
  destination: string;
  date: string;
  createdAt: string;
  time?: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState('');

  // Get IP Address for API calls
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (error) {
        console.error('Failed to get IP address:', error);
      }
    };
    getIpAddress();
  }, []);

  // Fetch trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      if (!token || !ipAddress) return;

      try {
        const response = await axios.get(`http://${ipAddress}:8000/api/history/trips`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Format the trips data
        const formattedTrips = response.data.map((trip: any) => ({
          id: trip.id,
          destination: trip.destination,
          date: new Date(trip.date).toLocaleDateString(),
          time: new Date(trip.date).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));

        setTrips(formattedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token, ipAddress]);

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
          {loading ? (
            <ActivityIndicator size="large" color="#E17636" style={styles.loader} />
          ) : trips.length === 0 ? (
            <Text style={styles.noTripsText}>No trips found</Text>
          ) : (
            trips.map((trip, index) => (
              <TouchableOpacity
                key={trip.id || index}
                style={styles.btn}
                onPress={() => router.push(`../conversation?tripId=${encodeURIComponent(trip.id)}`)}
              >
                <View style={styles.tripContainer}>
                  <Text style={styles.btnText}>{trip.destination}</Text>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateText}>{trip.date}</Text>
                    <Text style={styles.timeText}>{trip.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  loader: {
    marginTop: 20,
  },
  noTripsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});


