import React, { Component } from 'react';
import axios from 'axios';
import './../App.css';

class LandingPage extends Component {
    constructor() {
        super();
        this.state = {
            granted: false
        }
    }

    componentDidMount(){
        axios.get('/home') 
            .then(response => {
                console.log(response);

                let grantedStatus = response.data.granted;
                this.setState({granted:grantedStatus})
            }).catch(error => {
                console.log("Error: \n", error);
            })
        
    }


    render() {
        return (
            
            <div>Logged in to system</div>
        );
    }
}

export default LandingPage;