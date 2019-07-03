import React from 'react';
import { Route } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
import SessionProvider from './SessionProvider.js';

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

  return (
    <Route render={routeProps => {
      return (
        <SessionProvider foreignState={foreignState()} firebase={props.firebase}>
          <Route exact path='/' component={Splash} />
          <Route strict path='/auth/' {...routeProps} render={muhProps => {
            return <Auth {...muhProps} />;
          }} />
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
