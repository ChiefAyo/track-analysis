const express = require('express')
const cors = require('cors')
const path = require('path');
require('dotenv').config({ path: __dirname + '/./../.env' });
const axios = require('axios');
const bodyParser = require('body-parser')
const url = require('url')



const app = express();
const port = process.env.PORT || 8888;

// TODO shortcut for cors not working, maybe try longer full method instead
// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
app.use(cors());

app.use(bodyParser.json());
// var jsonParser = bodyParser.json();np

var SpotifyWebApi = require('spotify-web-api-node');

app.post('/login', (req, res) => {

    const code = req.body.code
    const error = req.body.error


    let tokens = setInitialAccessToken(code);

    res.json({
        access_token:tokens.access_token,
        refresh_token:tokens.refresh_token,
        expires_in:tokens.expires_in
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400)
    })

})

app.post('/refresh', (req, res) => {
    const refreshTk = req.body.refreshTk

    SpotifyWebApi.setRefreshToken(refreshTk);
    resetToken()
})

//var urlEncodedPrser = bodyParser.urlencoded({extended: false})

//logs fact that server is runninig and starts the server

app.get('/express_backend', (req, res) => {
    res.send({ express: "EXPRESS BACKEND IS CONNECTED TO REACT" })
})

const clientId = process.env.SPOTAPI_ID;
const clientSecret = process.env.SPOTAPI_SECRET;

//connect to spotify api
var spotifyAPI = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: clientId,
    clientSecret: clientSecret
});



// permissions given to applicaiton
const scopes = [
    "user-read-recently-played",
    "user-top-read",
    "playlist-modify-public",
    "user-read-currently-playing",
    "user-follow-read",
    "user-library-read",
    "user-read-private",
    "user-read-email"
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
    authURL += encodeURIComponent('&redirect_uri=http://localhost:8888/auth_done');
    authURL += encodeURIComponent(`&state=${state}`);
    //remove blank space from end of scopeString with .trim()
    authURL += encodeURIComponent(`&scope=${scopeString.trim()}`)
    authURL += '&show_dialog=true';

    return authURL;
}

console.log('URL: ', generateURL())

// redirect user to authorisation link
// app.get('/login', (req, res) => {
//     //console.log(authoriseURL);
//     // generateURL()
//     // .then(url => {
//     //     res.redirect(url);
//     // })
//     //console.log(clientId);
//     try {

//         console.log("Attempting redirect")
//         res.redirect(authoriseURL,)
        

//     } catch (error) {
//         console.log("Error trying to log in to Spotify: \n");
//         console.log(error);
//     }
// });

var spotRes
app.get('/auth_done', (req, res) =>{

    spotRes = req
    console.log("Authorised")
    // console.log(req)
    res.redirect("http://localhost:3000/home")
})

//gets data from the callback including the auth code
app.get('/home', (req, res) => {


    //TODO sort out whatever is going wrong here, req is empty and
    //stopping progress
    console.log('Request: ');
    console.log(spotRes.query);
    let result = spotRes.query;

    const error = result.error; 
    //auth code for access token
    const code = result.code;
    const state = result.state;
    
    // console.log(spotifyAPI.getAccessToken())

    if (!error && spotRes) {
    
        async () => {

            if (await setInitialAccessToken(code)) {
                setInterval(async () => {
                    await resetToken();
                    console.log("Access token reset")
                }, 60 * 60 * 1000)
            }
        }

        console.log(`Access token 1: ${spotifyAPI.getAccessToken()}`)

        var displayName 
        axios({
            url: "https://api.spotify.com/v1/me",
            method: 'GET',
            headers: {
                "Authorization" : `Bearer ${spotifyAPI.getAccessToken()}`
            }
        }) .then(response => {
            displayName = response.display_name;
        })
        .catch(error => {
            console.log("Error trying to get display name: ")
            console.log(error)
        })
        // TODO problem with axios, potentially spotify link is wrong ?? 

        let response = {
            granted: true,
            info: "Access has been granted",
            name: displayName
        }

        //res.send(response);
        //res.redirect("http://localhost:3000/home")
        const home_url = new URL("https://localhost:3000")
        home_url.pathname = "/home"
        home_url.searchParams.append("granted", "true")
        home_url.searchParams.append("info", "access granted")
        home_url.searchParams.append("name", displayName)
        // res.redirect(home_url.format({
        //     pathname: "home",
        //     query: {
        //         "granted": true,
        //         "info": "Access has been granted",
        //         "name": displayName
        //     }
        // }));
        res.redirect(home_url.href)

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
            let expiresIn = data.body['expires_in']
            spotifyAPI.setAccessToken(accessTk);
            spotifyAPI.setRefreshToken(accessRefresh);
            console.log(`Access token: ${accessTk} \n Refresh token: ${accessRefresh}`);

            let tokens = {
                access_token:accessTk,
                refresh_token:accessRefresh,
                expires_in:expiresIn
            }

            return tokens;
        }
        ).catch(error => {
            console.log('Error trying to retrieve token:');
            console.log(error);
            //res.send
            return {};
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



