import * as AuthSession from 'expo-auth-session';
import { useState, useEffect } from 'react';

// CLIENT_ID from Spotify Developer dashboard
const CLIENT_ID = 'ff4829cf858b451b9e86367a336d34b6';

// generate redirect uri which redirects the user back to my app after authentication
const REDIRECT_URI = AuthSession.makeRedirectUri();

// define scopes to allow communication with certain endpoints in the API
const SCOPES = ['streaming', 'playlist-read-private', 'playlist-read-collaborative', 'user-modify-playback-state'];
// ** FUTURE USE: 'user-top-read' for top artists and tracks display

// contain endpoint URLS in object for easy calling
const authEPs = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token'
};

export const getAccessToken = () => {
    // useState to store access token

    const [token, setToken] = useState<string | null>(null);

    // we encapsulate the 'fetchToken' helper function in a useEffect in order to make sure the function is ran at appropriate lifecycle events
    useEffect(() => {
        const fetchToken = async () => {
            const response = await AuthSession.startAsync({
                authUrl: `${authEPs.authorizationEndpoint}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join(' ')}`
            });

            if (response.type === 'success') {
                const { code } = response.params;

                const tokenResponse = await fetch(authEPs. tokenEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=your_spotify_client_secret`
                });

                const tokenData = await tokenResponse.json();

                setToken(tokenData.access_token);
            }
        };

        fetchToken();
    }, []);

    return token;
};