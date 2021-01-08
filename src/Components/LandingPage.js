import React, { Component } from 'react';
import axios from 'axios';
import './../App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthenticateButton from './AuthenticateButton';

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
                let displayName = response.data.name
                this.setState({ granted: grantedStatus, name: displayName})
            }).catch(error => {
                console.log("Error: \n", error);
            })

    }


    render() {

        if (!this.state.granted) {
            let status;
            return (
                <>
                    <div>Not currently logged in, please log in</div>
                    <AuthenticateButton />
                </>
            );
        } else {

            return (
                <Router>
                    <Sidebar />
                    <Switch>
                        <div>Hi there {this.state.name}!</div>
                        <Route exact path='/home' component={this} />
                    </Switch>
                </Router>
            );
        }
    }
}

export default LandingPage;