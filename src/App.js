import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
import SessionProvider from './SessionProvider.js';

const App = props => {

  // const [isSignedOut, setIsSignedOut] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
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
    props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setIsAuth(true);
      } else if (!user) {
        // localStorage.removeItem('potatoStorage');
        setIsAuth(false);
      }
    });
  });

  const handleSignOut = async uid => {
    const userStatusDatabaseRef = await props.firebase.database().ref(`/USERS_ONLINE/${uid}`);
    const activityRef = await props.firebase.database().ref(`/users/${uid}/activity`);
    await activityRef.remove();
    await userStatusDatabaseRef.remove();
    localStorage.removeItem('potatoStorage');
    props.firebase.auth().signOut();
    setIsSignedOut(true);
    setIsAuth(false);
  }

  return (
    <Route render={routeProps => {
      const { history } = props;
      return (
        <React.Fragment>
          <Route exact path='/' {...routeProps} render={duhProps => {
            return <Splash isAuth={isAuth} {...duhProps} />;
          }} />
          <Route strict path='/auth/' {...routeProps} render={muhProps => {
            return <Auth isSignedOut={isSignedOut} {...muhProps} />;
          }} />
          <SessionProvider foreignState={foreignState()} firebase={props.firebase}>
            <Route exact path='/chat/dashboard' component={Dashboard} />
            <Route exact path='/chat/userProfile' {...routeProps} render={profileProps => {
              if (!isAuth) {
                return <Redirect to={'/'} />
              } else {
                return <UserProfile {...profileProps} firebase={props.firebase} handleSignOut={handleSignOut} />
              }
            }} />
            <Route exact path='/chat/rooms' render={luhProps => {
              return <Chat isAuth={isAuth} {...luhProps} />
            }} />
            <Route component={null} />
          </SessionProvider>
        </React.Fragment>
      );
    }} />
  );
};

export default App;
