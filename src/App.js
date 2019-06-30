import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route strict path='/auth/' component={Auth} />
        <Route exact path='/chat/dashboard' component={Dashboard} />
        <Route exact path='/chat/userProfile' component={UserProfile} />
        <Route exact path='/chat/rooms/*' {...this.props} render={routerProps => {
          if (true) {
            console.log(routerProps);
            console.log(this.props);
          }
          return <Chat {...routerProps} />;
        }}/>
        <Route component={null} />
      </Switch>
    );
  };
};

export default withRouter(App);
