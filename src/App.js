import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
// import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
import RegistrationForm from './Auth/RegistrationForm.js';
import SignInWithEmailForm from './Auth/SignInWithEmailForm.js';
import VerificationForm from './Auth/VerificationForm.js';
import SessionProvider from './SessionProvider.js';
import useForm from './Auth/useForm.js';
import useOAuth from './Auth//useOAuth.js';
import useAuthLink from './hooks/useAuthLink.js';

const App = props => {
  const foreignState = () => {
    const foreignState = {};
    const urlParams = new URLSearchParams(window.location.search);
    var entries = urlParams.entries();
    for (const pair of entries) {
      foreignState[pair[0]] = pair[1];
    }
    return foreignState;
  }

  const { oAuthResponse, setOAuthResponse } = useOAuth();
  const { isNewUser, emailMethods } = useOAuth();
  const { isAuthLinkSent } = useAuthLink();
  const urlState = useState(foreignState());

  return (
    <Route render={routeProps => {
      const { history } = routeProps;
      if (oAuthResponse) {
        setOAuthResponse(false);
        history.push(`/chat/rooms/?rm=lastVisited`);
        // return null;
      }
      if (isAuthLinkSent) {
        setOAuthResponse(false);
        history.push(`/auth/verification`);
        // return null;
      }
      return (
        <SessionProvider foreignState={urlState} firebase={props.firebase}>
          <Route exact path='/' component={Splash} />
          <Route exact path='/auth/registration' component={RegistrationForm} />
          <Route exact path='/auth/verificaton' component={VerificationForm} />
          <Route exact path='/chat/dashboard' component={Dashboard} />
          <Route exact path='/chat/userProfile' component={UserProfile} />
          <Route exact path='/chat/rooms' component={Chat} />
          <Route component={null} />
        </SessionProvider>
      );
    }} />
  );

};

export default App;
