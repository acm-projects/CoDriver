import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

interface SpotifyBarProps {
  ipAddress: string;
}

interface SongInfo {
  title: string;
  artist: string;
  album: string;
  albumCover: string;
}

const SpotifyBar: React.FC<SpotifyBarProps> = ({ ipAddress }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState<SongInfo>({
    title: '',
    artist: '',
    album: '',
    albumCover: ''
  });

  const fetchCurrentSong = async () => {
    try {
      // console.log('Fetching current song from:', `http://${ipAddress}:8000/api/music/currentSong`);
      const [songResponse, coverResponse] = await Promise.all([
        axios.get(`http://${ipAddress}:8000/api/music/currentSong`),
        axios.get(`http://${ipAddress}:8000/api/music/currentSongCover`)
      ]);

      // console.log('Song response:', songResponse.data);
      //console.log('Cover response:', coverResponse.data);

      const songData = songResponse.data.data;
      const coverData = coverResponse.data;

      setSongInfo({
        title: songData?.title || 'No song playing',
        artist: songData?.artist || '',
        album: songData?.album || '',
        albumCover: coverData || require('../assets/images/album_default.png')
      });

      setIsPlaying(songData?.isPlaying || false);
    } catch (error) {
      console.error('Error fetching current song:', error);
      if (axios.isAxiosError(error)) {
        console.error('Full error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    }
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await axios.post(`http://${ipAddress}:8000/api/music/pause`);
      } else {
        await axios.post(`http://${ipAddress}:8000/api/music/play`);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  useEffect(() => {
    fetchCurrentSong();
    // Set up polling to update song info periodically
    const interval = setInterval(fetchCurrentSong, 5000);
    return () => clearInterval(interval);
  }, [ipAddress]);

  return (
    <TouchableOpacity style={styles.spotifyTab} onPress={togglePlayPause}>
      {/* Left Section: Album Cover */}
      <View style={styles.leftSection}>
        <Image
          source={typeof songInfo.albumCover === 'string' ? { uri: songInfo.albumCover } : songInfo.albumCover || require('../assets/images/album_default.png')}
          //source={songInfo.albumCover ? { uri: songInfo.albumCover } : require('../assets/images/album_default.png')}
          style={styles.albumCover}
          onError={(e) => console.error('Error loading album cover:', e.nativeEvent.error)}
          onLoad={() => console.log('Album cover loaded successfully', songInfo.albumCover)}
        />
      </View>

      {/* Right Section: Song Info and Controls */}
      <View style={styles.rightSection}>
        {/* Song Title, Artist, and Album */}
        <View style={styles.textContainer}>
          <Text style={styles.spotifyTabText} numberOfLines={2} ellipsizeMode="tail">
            {songInfo.title} · {songInfo.artist} · {songInfo.album}
          </Text>
        </View>

        {/* Play/Pause Button */}
        <Image
          source={isPlaying ? require('../assets/images/pause1.png') : require('../assets/images/play1.png')}
          style={styles.playPauseButton}
          onError={(e) => console.error('Error loading play/pause button:', e.nativeEvent.error)}
          onLoad={() => console.log('Play/pause button loaded successfully')}
        />
      </View>

      {/* Progress Bar */}
      {/* <View style={styles.bottomSection}>
        <Image
          source={require('../assets/images/progress_bar.png')}
          style={styles.progressBar}
          resizeMode="contain"
          onError={(e) => console.error('Error loading progress bar:', e.nativeEvent.error)}
          onLoad={() => console.log('Progress bar loaded successfully')}
        />
      </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spotifyTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    backgroundColor: '#2D2A38',
    borderColor: '#2D2A38',
    marginTop: 656,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    zIndex: 10,
    flex: 1,
    marginHorizontal: 20,
  },
  spotifyTabText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#AE9A8C',
    flex: 1,
    flexShrink: 1,
    textAlign: 'left',
    marginRight: 10,
    flexWrap: 'wrap',
  },
  albumCover: {
    width: 45,
    height: 45,
    marginRight: 8,
    marginLeft: 0,
    borderRadius: 5,
  },
  leftSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 10,
  },
  rightSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: 8,
    paddingRight: 10,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    width: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  progressBar: {
    width: '90%',
    height: 7,
    marginLeft: -2
  },
  playPauseButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 0,
    borderRadius: 5,
    marginTop: 2,
  },
  songInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  artistAlbumText: {
    fontSize: 12,
    color: '#AE9A8C',
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    minHeight: 40,
  },
});

export default SpotifyBar;
