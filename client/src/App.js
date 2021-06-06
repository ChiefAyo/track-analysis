import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthenticateButton from './Components/AuthenticateButton';
import LandingPage from './Components/LandingPage';



function App() {

/*   constructor(props) {
    super(pros)
  }

  state = {
    renderedResponse: ''
  }

  getResponse = async() => {
    const response = await fetch('/api/hello')
    const body = await response.json

    if(response.status != 200) throw Error(body.message)

    return body;
  }

  componentDidMount() {
    this.getResponse()
      .then(res => {
        const someData = res;
        this.setState({renderedResponse: someData});
      })
  } */

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
