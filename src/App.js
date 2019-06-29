import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Auth from './Auth/Auth.js';
import Splash from './Splash/Splash.js';
import Dashboard from './Dashboard/Dashboard.js';
import UserProfile from './UserProfile/UserProfile.js';
import Chat from './Chat/Chat.js';
// import SessionContext from './SessionContext.js';

class App extends React.Component {
  // static contextType = SessionContext;
  componentDidMount() {
    // localStorage.setItem('potatoAuth', 'null string');
    // this.props.firebase.auth().onAuthStateChanged(user => {
    //   const potatoAuth = JSON.parse(localStorage.getItem('potatoAuth'));
    //   if (!user) {
    //     this.props.firebase.auth().signOut();
    //   } else {
    //     this.context.initializeApp(user);
    //     console.log('from App.js', potatoAuth);
    //   }
    // });
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
