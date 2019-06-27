import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Layout from './Layout/Layout.js';
import Splash from './Splash/Splash.js';

const App = ({ history }) => {
  history.listen((location, action) => {
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
  });
  return (
    <Switch>
      <Route exact path='/' component={Splash} />
      <Route strict path='/auth/' component={Auth} />
      <Route path='/chat' component={Layout} />
      <Route component={null} />
    </Switch>
  );
};

export default withRouter(App);


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
