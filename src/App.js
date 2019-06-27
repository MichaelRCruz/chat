import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Layout from './Layout/Layout.js';
import Splash from './Splash/Splash.js';

class App extends React.Component {
  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.firebase.auth().signOut();
        return <Redirect to="/auth/signin"/>;
      }
    });
  };
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


// if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
//   const stashedEmail = window.localStorage.getItem('emailForSignIn');
//   firebase.auth()
//     .signInWithEmailLink(stashedEmail, window.location.href)
//     .then(result => {
//       if (result.credential) {
//         window.localStorage.removeItem('emailForSignIn');
//         const { credential, user } = result;
//         const isNewUser = result.additionalUserInfo.isNewUser;
//         this.setState({ credential, isNewUser });
//       }
//     })
//     .catch(error => {
//       this.setState({ error, onSignInWithEmailLinkError: true });
//     });
