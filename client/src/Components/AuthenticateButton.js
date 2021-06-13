import React, { useCallback, useEffect } from 'react';
import './../App.css';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

function AuthenticateButton(props) {
    

    //let redirect = 
    const goToAuth = async () =>{
        console.log("Authenticating")
        await axios.get('/login')
            .then(res => {
                //TODO Need to send request to login, then return to here landing page after
                console.log("Response: ",res)
            })
    }

    return (
        //TODO THIS IS ANNOYING AF!!
        <Router>
            <button onClick={goToAuth} className="spotify-button">Allow access</button>
        </Router>
    );
}

export default AuthenticateButton;