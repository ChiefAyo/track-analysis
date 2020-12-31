const express = require('express')
const path = require('path');
require('dotenv').config({ path: __dirname + '/./../../.env' });
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8888;

var SpotifyWebApi = require('spotify-web-api-node');




//logs fact that server is runninig and starts the server
app.listen(port, () => console.log(`Listening on port: ${port}`));

app.get('/express_backend', (req, res) => {
    res.send({ express: "EXPRESS BACKEND IS CONNECTED TO REACT" })
})

const clientId = process.env.SPOTAPI_ID;
const clientSecret = process.env.SPOTAPI_SECRET;

//connect to spotify api
var spotifyAPI = new SpotifyWebApi({
    redirectUri: 'http://localhost:8888/home',
    clientId: clientId,
    clientSecret: clientSecret
});

spotifyAPI.setClientId(clientId);

const scopes = [
    "user-read-recently-played",
    "user-top-read",
    "playlist-modify-public",
    "user-read-currently-playing",
    "user-follow-read",
    "user-library-read",
]

var scopeString;
scopes.forEach(scope => scopeString += (scope + ' '))

var state = 'sth536d'

var authoriseURL = spotifyAPI.createAuthorizeURL(scopes, state, true);

const generateURL = async () => {
    let authURL = "https://accounts.spotify.com/authorize?";
    authURL += encodeURIComponent(`client_id=${clientId}`);
    authURL += '&response_type=code';
    authURL += encodeURIComponent('&redirect_uri=http://localhost:8888/home');
    authURL += encodeURIComponent(`&state=${state}`);
    //remove blank space from end of scopeString with .trim()
    authURL += encodeURIComponent(`&scope=${scopeString.trim()}`)
    authURL += '&show_dialog=true';

    return authURL;
}


// redirect user to authorisation link
app.get('/login', (req, res) => {
    //console.log(authoriseURL);
    // generateURL()
    // .then(url => {
    //     res.redirect(url);
    // })
    //console.log(clientId);
    try {

        res.redirect(authoriseURL)

    } catch (error) {
        console.log("Error trying to log in to Spotify: \n");
        console.log(error);
    }
});

//gets data from the callback including the access token
app.get('/home', (req, res) => {
    const error = req.query.error;
    //auth code for access token
    const code = req.query.code;
    const state = req.query.state;


    if (!error) {
        if (!spotifyAPI.getAccessToken()) {
            if (setInitialAccessToken(code)) {
                setInterval(async () => {
                    resetToken();
                }, 60 * 60 * 1000)
            }
        }

    } else {
        console.log("Error trying to authenticate");
        console.log(error)
        res.send("Error From callback: ", error)
        return;
    }
})

// sets the access token once the user has been authorised
const setInitialAccessToken = (code) => {
    spotifyAPI.authorizationCodeGrant(code)
        .then(data => {
            let accessTk = data.body['access_token'];
            let accessRefresh = data.body['refresh_token'];
            spotifyAPI.setAccessToken(accessTk);
            spotifyAPI.setRefreshToken(accessRefresh);
            console.log(`Access token: ${accessTk} \n Refresh token: ${accessRefresh}`);

            return true;
        }
        ).catch(error => {
            console.log('Error trying to retrieve token:');
            console.log(error);
            //res.send
            return;
        })
}

/**
 * Function to reset the access token every hour
 */
const resetToken = async () => {
    const data = await spotifyAPI.refreshAccessToken();
    const newToken = data.body['access_token']

    console.log('access token refreshed, new token is:', newToken)
    spotifyAPI.setAccessToken(accessRefresh)
}


