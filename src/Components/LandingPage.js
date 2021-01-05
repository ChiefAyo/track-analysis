import React, { Component } from 'react';
import axios from 'axios';
import './../App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './Sidebar';

class LandingPage extends Component {
    constructor() {
        super();
        this.state = {
            granted: false
        }
    }

    componentDidMount() {
        axios.get('/home')
            .then(response => {
                console.log(response);

                let grantedStatus = response.data.granted;
                this.setState({ granted: grantedStatus })
            }).catch(error => {
                console.log("Error: \n", error);
            })

    }


    render() {
        return (
            <Router>
                <Sidebar />
                <Switch>
                <div>Logged in to system</div>
                <Route path = '/'/>
                </Switch>
            </Router>
        );
    }
}

export default LandingPage;