import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
import SessionProvider from './SessionProvider.js';

const App = props => {

  const [isSignedOut, setIsSignedOut] = useState(false);

  const foreignState = () => {
    const foreignState = {};
    const urlParams = new URLSearchParams(window.location.search);
    var entries = urlParams.entries();
    for (const pair of entries) {
      foreignState[pair[0]] = pair[1];
    }
    return foreignState;
  }

  useEffect(() => {
    // const user = props.firebase.auth().currentUser;
    // if (user) {
    //   setIsSignedOut(false);
    // } else if (!user) {
      // setIsSignedOut(true);
    // }
  });

  const handleSignOut = () => {
    localStorage.removeItem('potatoStorage');
    props.firebase.auth().signOut();
    setIsSignedOut(true);
    // setIsSignedOut(true);
  }

  return (
    <Route render={routeProps => {
      const { history } = props;
      return (
        <SessionProvider foreignState={foreignState()} firebase={props.firebase}>
          <Route exact path='/' component={Splash} />
          <Route strict path='/auth/' {...routeProps} render={muhProps => {
            return <Auth isSignedOut={isSignedOut} {...muhProps} />;
          }} />
          <Route exact path='/chat/dashboard' component={Dashboard} />
          <Route exact path='/chat/userProfile' {...routeProps} render={profileProps => {
            if (isSignedOut) {
              return <Redirect to={'/'} />
            } else {
              return <UserProfile {...profileProps} firebase={props.firebase} handleSignOut={handleSignOut} isSignedOut={isSignedOut} />
            }
          }} />
          <Route exact path='/chat/rooms' component={Chat} />
          <Route component={null} />
        </SessionProvider>
      );
    }} />
  );
};

export default App;
