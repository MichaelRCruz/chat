import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Auth from './Auth/Auth.js';
// import Layout from './Layout/Layout.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';

class App extends React.Component {
  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.firebase.auth().signOut();
        // const { clearContext } = this.context;
        // clearContext();
      }
    });
  };
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route strict path='/auth/' component={Auth} />
        <Route exact path='/chat/dashboard' component={Dashboard} />
        <Route exact path='/chat/userProfile' component={UserProfile} />
        <Route path='/chat/rooms/:roomid' component={Chat} />
        <Route component={null} />
      </Switch>
    );
  };
};

export default withRouter(App);
