import React from 'react';
import { useEffect, useState } from 'react';

import axios from 'axios';
import './../App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthenticateButton from './AuthenticateButton';
import useAuth from "./useAuth";
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId:process.env.SPOTAPI_ID
})



export default function LandingPage(props) {

    
    
    const accessTk = useAuth(props.code)

    const headers = {
        Authorization: `Bearer ${accessTk}`,
        'Content-type': 'application/json',
    }
    //const [profileInfo, setProfileInfo] = useState();

    useEffect(() => {
        if(!accessTk) return
        spotifyApi.setAccessToken(accessTk)
    }, [accessTk]);


        //TODO Works, and gets details, but very quickly throws an error
    
    
    //    spotifyApi.getMe()
    //    .then(data => {
    //        console.log(data.body);
    //    })

    let getName = () => {

        let user;
        spotifyApi.getMe()
            .then(data => {
                console.log(data.body)

                user = data.body.display_name;

            })
            .catch(error => {
                console.log("Error trying to get name: ", error)
            })

        axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term', { headers })
            .then(data => {
                console.log(data)

            }).catch(error => {
                console.log("Error trying to get top tracks: ", error)
            })

        return user;

    }

    let getData = () => {

    }


    return (
        <Router>
            <Sidebar />
            <div className="name-section">
                <div className="user-info">Hi there {getName()}, welcome to *****!</div>
            </div>


        </Router>
    );
        //}
    
}
