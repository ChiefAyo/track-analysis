import React, { useCallback, useEffect } from 'react';
import './../App.css';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

//require('dotenv').config({ path: __dirname + '/./../.env' });

//let redirect = "http://localhost:8888/authorised"

//TODO Not able to get variable from environment variable
const AUTHORSISATION = `https://accounts.spotify.com/authorize?&client_id=${process.env.REACT_APP_SPOTAPI_ID}&response_type=code&show_dialog=true&redirect_uri=${process.env.REACT_APP_REDIRECT}&scope=user-read-recently-played%20user-top-read%20playlist-modify-public%20user-read-currently-playing%20user-follow-read%20user-library-read%20user-read-private%20user-read-email`

function AuthenticateButton(props) {
    

    // //let redirect = 
    // const goToAuth = async () =>{
    //     console.log("Authenticating")
    //     // await axios.get('/login')
    //     //     .then(res => {
    //     //         //TODO Need to send request to log in, then return to here landing page after
    //     //         console.log("Response: ",res)
    //     //     })

    //     window.location = AUTHORSISATION
    // }

    return (
        //TODO THIS IS ANNOYING AF!!
        <Router>
            <a href={AUTHORSISATION} className="spotify-button">Allow access</a>
        </Router>
    );
}

export default AuthenticateButton;