import React from 'react';
import { Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase';
import SessionProvider from '../SessionProvider.js';
import Dashboard from '../Dashboard/Dashboard.js';
import UserProfile from '../UserProfile/UserProfile.js';
import Chat from '../Chat/Chat.js';
import './Layout.css';

class Layout extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signOut();
      }
    });
  };

  render() {
    return (
      <SessionProvider firebase={firebase} >
        <Route exact path='/chat/dashboard' component={Dashboard} />
        <Route exact path='/chat/userProfile' component={UserProfile} />
        <Route exact path='/chat/rooms/:roomid' component={Chat} />
      </SessionProvider>
    );
  }
}

export default Layout;
