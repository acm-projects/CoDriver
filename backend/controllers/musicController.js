require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

// secret keys in .env file hehehe
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// music controller (if not working, make sure ur logged in)
class MusicController {
  async play() {
    try {
      await spotifyApi.play();
      return { success: true, message: 'Playback started' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async pause() {
    try {
      await spotifyApi.pause();
      return { success: true, message: 'Playback paused' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async skipToNext() {
    try {
      await spotifyApi.skipToNext();
      return { success: true, message: 'Skipped to next track' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async skipToPrevious() {
    try {
      await spotifyApi.skipToPrevious();
      return { success: true, message: 'Skipped to previous track' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async login() {
    try {
      const scopes = [
        'user-modify-playback-state',
        'user-read-playback-state'
      ];
      const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
      return { success: true, url: authorizeURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async callback(code) {
    try {
      const data = await spotifyApi.authorizationCodeGrant(code);
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      return { success: true, message: 'Authentication successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // create a getCurrentSong method that returns the current song artist, album, and title
  async getCurrentSong() {
    try {
      const data = await spotifyApi.getMyCurrentPlayingTrack();
      
      if (!data.body || !data.body.item) {
        return {
          success: false,
          error: 'No track currently playing'
        };
      }

      const track = data.body.item;
      return {
        success: true,
        data: {
          title: track.name,
          artist: track.artists.map(artist => artist.name).join(', '),
          album: track.album.name,
          isPlaying: data.body.is_playing,
          duration: track.duration_ms,
          progress: data.body.progress_ms
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  //  create a getAlbumCover method 
  async getAlbumCover() {
    try {
      const data = await spotifyApi.getMyCurrentPlayingTrack();
      return data.body.item.album.images[0].url;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
}

module.exports = new MusicController();

