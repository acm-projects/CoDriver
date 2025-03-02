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
}

module.exports = new MusicController();
