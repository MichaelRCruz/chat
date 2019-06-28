import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Layout from './Layout/Layout.js';
import Splash from './Splash/Splash.js';
import SessionContext from './SessionContext.js';

class App extends React.Component {
  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.firebase.auth().signOut();
      }
      const { initializeApp } = this.context;
      initializeApp(user);
    });
  };
  static contextType = SessionContext;
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route strict path='/auth/' component={Auth} />
        <Route path='/chat' component={Layout} />
        <Route component={null} />
      </Switch>
    );
  };
};

export default App;
