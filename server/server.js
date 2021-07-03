const express = require('express')
const cors = require('cors')
const path = require('path');
require('dotenv').config({ path: __dirname + '/./../.env' });
const axios = require('axios');
const bodyParser = require('body-parser')


const app = express();
const port = process.env.PORT || 8888;

// TODO shortcut for cors not working, maybe try longer full method instead
// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
app.use(cors());

app.use(bodyParser.json());
// var jsonParser = bodyParser.json();np

var SpotifyWebApi = require('spotify-web-api-node');


//var urlEncodedPrser = bodyParser.urlencoded({extended: false})

//logs fact that server is runninig and starts the server

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
console.log("ID: ", clientId)

// permissions given to applicaiton
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

var state = 'sth536d';

var authoriseURL = spotifyAPI.createAuthorizeURL(scopes, state, true);
console.log("Authorise url: " + authoriseURL + "\n");


// used as a test to make sure api was actually working
/**
 * Long form method for generating a URL without the api
 * @returns the authorisation URL
 */
const generateURL = async () => {
    let authURL = "https://accounts.spotify.com/authorize?";
    authURL += encodeURIComponent(`&client_id=${clientId}`);
    authURL += '&response_type=code';
    authURL += encodeURIComponent('&redirect_uri=http://localhost:8888/home');
    authURL += encodeURIComponent(`&state=${state}`);
    //remove blank space from end of scopeString with .trim()
    authURL += encodeURIComponent(`&scope=${scopeString.trim()}`)
    authURL += '&show_dialog=true';

    return authURL;
}

console.log('URL: ', generateURL())

// redirect user to authorisation link
app.get('/login', (req, res) => {
    //console.log(authoriseURL);
    // generateURL()
    // .then(url => {
    //     res.redirect(url);
    // })
    //console.log(clientId);
    try {

        console.log("Attempting redirect")
        res.redirect(authoriseURL,)
        

    } catch (error) {
        console.log("Error trying to log in to Spotify: \n");
        console.log(error);
    }
});

//gets data from the callback including the auth code
app.get('/home', (req, res) => {

    //TODO sort out whatever is going wrong here, req is empty and
    //stopping progress
    console.log('Request: ');
    console.log(req.query);
    let result = req.query;

    const error = result.error;
    //auth code for access token
    const code = result.code;
    const state = result.state;

    

    

    if (!error) {
        if (typeof spotifyAPI.getAccessToken() == 'undefined') {
            if (setInitialAccessToken(code)) {
                setInterval(async () => {
                   await resetToken();
                    console.log("Access token reset")
                }, 60 * 60 * 1000)
            }
        }

        console.log(`Access token 1: ${spotifyAPI.getAccessToken()}`)

        //TODO send name to client scripts to show up when the user logs in
        var displayName;
        axios({
            url: "https://api.spotify.com.v1/me",
            method: 'GET',
            headers: {
                "Authorization" : `Bearer ${spotifyAPI.getAccessToken()}`
            }
        }) .then((response) => {
            displayName = response.display_name;
        })

        let response = {
            granted: true,
            info: "Access has been granted",
            name: displayName
        }

        res.send(response);

    } else {
        console.log("Error trying to authenticate");
        console.log(error)
        res.send("Error From callback: ", error)
        return;
    }
})

// sets the access token once the user has been authorised
const setInitialAccessToken = (code) => {
    console.log(`Code: ${code}`);
    spotifyAPI.authorizationCodeGrant(code)
        .then(function(data)  {
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
            return false;
        })
}

/**
 * Function to reset the access token every hour
 */
const resetToken = async () => {
    await spotifyAPI.refreshAccessToken().then(data => {
        const newToken = data.body['access_token']
        console.log('access token refreshed, new token is:', newToken)
        spotifyAPI.setAccessToken(accessRefresh)
    
    })
    .catch(error => {
        console.log("Unable to refresh the token \n Reason: ", error.message);
    })
}


app.listen(port, () => console.log(`Listening on port: ${port}`));



