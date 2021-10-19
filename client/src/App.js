import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthenticateButton from './Components/AuthenticateButton';
import LandingPage from './Components/LandingPage';

// check for auth code in the URL
const code = new URLSearchParams(window.location.search).get('code')

function App() {

  //  constructor(props) {
  //   super(pros)
  // }

  return (
    <Router>
      <div className="app-container">
        <div id="heading-logo">Title</div>
        <Switch>
          {code ? <Route path="/" exact element={<LandingPage code={code}/>} /> : <Route path="/" exact component={AuthenticateButton} />}
        </Switch>
        {code ? <LandingPage code={code}/> : <AuthenticateButton />}
      </div>
    </Router>
  );
}

export default App;
