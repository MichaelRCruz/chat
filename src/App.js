import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
import { parseQuery } from './utils.js';

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route strict path='/auth/' component={Auth} />
        <Route exact path='/chat/dashboard' component={Dashboard} />
        <Route exact path='/chat/userProfile' component={UserProfile} />
        <Route path='/chat/rooms' component={Chat} />
        <Route component={null} />
      </Switch>
    );
  };
};

export default App;
