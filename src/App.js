import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SessionProvider from './SessionProvider.js';
import Splash from './Splash/Splash.js';
import Layout from './Layout/Layout.js';
import SignIn from './SignIn/SignIn.js';

class App extends Component {
  render() {
    return (
        <nav>
        <SessionProvider firebase={this.props.firebase}>
          <Route exact path='/' render={() => <Splash firebase={this.props.firebase} /> } />
          <Route path='/chat' render={() => <Layout firebase={this.props.firebase} />} />
          <Route path='/signIn' render={() => <SignIn firebase={this.props.firebase} />} />
        </SessionProvider>
        </nav>
    );
  }
};

export default App;
