import React, { Component, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard.js';
import Splash from './Splash/Splash.js';
import Layout from './Layout/Layout.js';
import SignIn from './SignIn/SignIn.js';
import UserProfile from './UserProfile/UserProfile.js';
import Auth from './Auth/Auth.js';



class App extends Component {

  componentDidMount() {
    this.props.history.listen((location, action) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(`The last navigation action was ${action}`);
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route exact path='/auth' component={Auth} />
        <Route exact path='/chat/dashboard' component={Dashboard} />
        <Route exact path='/chat/userProfile' component={UserProfile} />
        <Route path='/chat/rooms/:roomid' component={Layout} />
        <Route component={Layout} />
      </Switch>
    );
  }
};

export default App;
