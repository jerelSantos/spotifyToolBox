import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { Button } from 'react-native';

// CLIENT_ID from Spotify Developer dashboard
const CLIENT_ID = 'ff4829cf858b451b9e86367a336d34b6';

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
          // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
          // this must be set to false
          usePKCE: false,
          redirectUri: redirectURI
        },
        discovery
      );

    useEffect(() => {
        if (response?.type === 'success') {
          const { code } = response.params;
          console.log(response.params);
        }
      }, [response]);
    
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