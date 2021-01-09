import React from 'react';
import './../App.css';
import { Link, BrowserRouter as Router } from 'react-router-dom';

function AuthenticateButton() {
    return (
        <Router>
            <a href="http://localhost:8888/login" className="spotify-button">Allow access</a>
        </Router>
    );
}

export default AuthenticateButton;