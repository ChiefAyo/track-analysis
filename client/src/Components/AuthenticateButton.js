import React from 'react';
import './../App.css';
import { Link, BrowserRouter as Router } from 'react-router-dom';

function AuthenticateButton() {
    return (
        //TODO THIS IS ANNOYING AF!!
        <Router>
            <a href="http://localhost:3000/login" className="spotify-button">Allow access</a>
        </Router>
    );
}

export default AuthenticateButton;