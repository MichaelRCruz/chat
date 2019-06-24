import React, { Component, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard.js';
import Splash from './Splash/Splash.js';
import Layout from './Layout/Layout.js';
import SignIn from './SignIn/SignIn.js';
import UserProfile from './UserProfile/UserProfile.js';
import Auth from './Auth/Auth.js';

const App = props => {
  props.history.listen((location, action) => {
    console.log(
      `The current URL is ${location.pathname}${location.search}${location.hash}`
    );
  });
  return (
    <Switch>
      <Route exact path='/' component={Splash} />
      <Route strict path='/auth/' component={Auth} />
      <Route exact path='/chat/dashboard' component={Dashboard} />
      <Route exact path='/chat/userProfile' component={UserProfile} />
      <Route exact path='/chat/rooms/:roomid' component={Layout} />
      <Route component={null} />
    </Switch>
  );
};

export default withRouter(App);
