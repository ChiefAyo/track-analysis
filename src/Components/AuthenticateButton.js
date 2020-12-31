import React from 'react';
import './../App.css';

function AuthenticateButton() {
    return (
        <a href = "http://localhost:8888/login" class = "spotify-button">Allow access</a>
    );
}

export default AuthenticateButton;