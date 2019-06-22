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

        <main>
          <Route exact path='/'
            component={Splash}
          />
          <Route path='/chat/:roomId/:message'
            component={Layout}
          />
          <Route path='/auth'
            component={Auth}
          />
        </main>

    );
  }
};

export default App;
