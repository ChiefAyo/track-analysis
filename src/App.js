import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthenticateButton from './Components/AuthenticateButton';
import LandingPage from './Components/LandingPage';


function App() {
  return (
    <Router>
      <div className="app-container">
        <div id="heading-logo">Title</div>
        <Switch>
          <Route path="/" exact component={AuthenticateButton} />
          <Route path="/home" component={LandingPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
