import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Splash from './Splash/Splash.js';
import Layout from './Layout/Layout.js';
import SignIn from './SignIn/SignIn.js';
import Auth from './Auth/Auth.js';

class App extends Component {
  render() {
    const { match, firebase } = this.props;
    return (
      <Switch>
        <Route exact path='/'
          component={Splash}
        />
        <Route exact path='/auth'
          component={Auth}
        />
        <Route path='/'
          component={Layout}
        />
      </Switch>
    );
  }
};

export default App;
