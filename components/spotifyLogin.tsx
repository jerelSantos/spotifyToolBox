import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CLIENT_ID from Spotify Developer dashboard
const CLIENT_ID = 'ff4829cf858b451b9e86367a336d34b6';
const CLIENT_SECRET = '6aa6142c20b6453d89658526dcd0a78e';

// define scopes to allow communication with certain endpoints in the API
const SCOPES = ['streaming', 'playlist-read-private', 'playlist-read-collaborative', 'user-modify-playback-state'];
// ** FUTURE USE: 'user-top-read' for top artists and tracks display

const redirectURI = AuthSession.makeRedirectUri({
    scheme: 'myapp'
});

// contain endpoint URLS in object for easy calling
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token'
};

// allows app to redirect to web browser when needed
WebBrowser.maybeCompleteAuthSession();

// *** I NEED TO CHANGE THIS TO EXPO useAuthRequest
export function SpotifyAuth() {
  // useState to store access token
  // const [token, setToken] = useState<string | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: CLIENT_ID,
        scopes: SCOPES,
        usePKCE: false,
        redirectUri: redirectURI
      },
      discovery
    );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log(response.params);
      exchangeCodeForToken(code);
    }
  }, [response]);

  // take code and exchange it for acess token
  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await axios.post(discovery.tokenEndpoint, new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectURI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const { access_token, refresh_token } = response.data;
      console.log('Access Token:', access_token);
      console.log('Refresh Token:', refresh_token);

      // store tokens securely using asyncStorage
      try {
        await AsyncStorage.setItem('accessToken', access_token);
        await AsyncStorage.setItem('refreshToken', refresh_token);
      } catch (error) {
        console.error('Error storing tokens:', error);
      }

    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };
    
  return (
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    );
};