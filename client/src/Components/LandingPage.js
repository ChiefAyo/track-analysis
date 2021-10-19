import React from 'react';
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
    // componentDidMount() {
    //     axios.get('/home')
    //         .then(response => {
    //             console.log(response);

    //             let grantedStatus = response.data.granted;
    //             let displayName = response.data.name
    //             this.setState({ granted: grantedStatus, name: displayName})
    //         }).catch(error => {
    //             console.log("Error: \n", error);
    //         })

    // }

        return (
            <Router>
                <Sidebar />
                
            </Router>
        );
        //}
    
}
