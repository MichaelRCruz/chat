import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
import SessionProvider from './SessionProvider.js';

const App = props => {

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

  const handleSignOut = async userConfig => {
    const unixStamp = await props.firebase.database.ServerValue.TIMESTAMP;
    const userStatusDatabaseRef = await props.firebase.database().ref(`/USERS_ONLINE/${userConfig.key}`);
    const activityRef = await props.firebase.database().ref(`/users/${userConfig.key}/activity`);
    const trafficRef = await props.firebase.database().ref(`/TRAFFIC`);
    const newTrafficRef = await trafficRef.push();
    await activityRef.remove();
    await userStatusDatabaseRef.remove();
    await newTrafficRef.set({ ...userConfig, unixStamp, action: 'OFFLINE' });
    localStorage.removeItem('potatoStorage');
    props.firebase.auth().signOut();
    setIsSignedOut(true);
    setIsAuth(false);
  }

  return (
    <Route render={routeProps => {
      // const { history } = props;
      return (
        <React.Fragment>
          <Route {...routeProps} exact path='/'
            render={splashProps => {
              return <Splash {...splashProps} isAuth={isAuth} />;
            }}
          />
          <Route {...routeProps} strict path='/auth/'
            render={authProps => {
              return <Auth {...authProps} isSignedOut={isSignedOut} />;
            }}
          />
          <SessionProvider firebase={props.firebase} foreignState={foreignState()}>
            <Route {...routeProps} exact path='/chat/dashboard'
              render={dashboardProps => {
                return <Dashboard {...dashboardProps} />;
              }}
            />
            <Route {...routeProps} exact path='/chat/userProfile'
              render={profileProps => {
                if (!isAuth) {
                  return <Redirect to={'/'} />;
                } else {
                  return (
                    <UserProfile {...profileProps}
                      firebase={props.firebase}
                      handleSignOut={handleSignOut}
                    />
                  );
                }
              }}
            />
            <Route {...routeProps} exact path='/chat/rooms'
              render={chatProps => {
                return <Chat {...chatProps} isAuth={isAuth} />;
              }}
            />
            <Route component={null} />
          </SessionProvider>
        </React.Fragment>
      );
    }} />
  );
};

export default App;
