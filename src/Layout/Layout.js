import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase';
import Dashboard from '../Dashboard/Dashboard.js';
import UserProfile from '../UserProfile/UserProfile.js';
import Chat from '../Chat/Chat.js';
import './Layout.css';

const Layout = () => {
  return (
    <Fragment>
      <Route exact path='/chat/dashboard' component={Dashboard} />
      <Route exact path='/chat/userProfile' component={UserProfile} />
      <Route exact path='/chat/rooms/:roomid' component={Chat} />
    </Fragment>
  );
}

export default Layout;
