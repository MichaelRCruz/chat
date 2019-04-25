import React, { Component } from 'react';
import './User.css';

import defaultUserImage from './../assets/images/tomatoes-default-user-image.png';

class User extends Component {
  constructor (props) {
    super(props);
    this.usersRef = this.props.firebase.database().ref('users');
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
      // var onComplete = function(error) {
      //   if (error) {
      //     console.log('Operation failed');
      //   } else {
      //     console.log(' Operation completed');
      //   }
      // };
      // this.usersRef.push(user.providerData[0]);
      // console.log(+user.providerData[0].uid, user.providerData[0]);
      // this.usersRef.child(user.providerData[0].uid).setValue(user.providerData[0], onComplete);
      // this.usersRef.orderByChild("uid").equalTo(user.providerData[0].uid).on("add_child", function(snapshot) {
      //   console.log('snapshot.val()', snapshot.val());
      //   if (!snapshot.val()) {
      //     this.usersRef.push(user.providerData[0]);
      //   } else {
      //
      //   }
      // });
    });
  }


  signIn() {
    this.props.firebase.auth().signInWithPopup( new this.props.firebase.auth.GoogleAuthProvider() );
  }

  signOut() {
    this.props.firebase.auth().signOut();
  }

  render() {
    return (
      <div id="user-display">
        <div id="avatar">
          <img src={ this.props.user ? this.props.user.photoURL : defaultUserImage } alt="user" />
        </div>
        <div id="user-display-name">{ this.props.user ? this.props.user.displayName.split(' ')[0] : 'Timid Tomato' }</div>
        <button className="sign-in-out"
                onClick={ this.props.user ? () => this.signOut() : this.signIn.bind(this) }>
          <i className="material-icons">power_settings_new</i>
          <span>Sign { this.props.user ? 'out' : 'in' }</span>
        </button>
      </div>
    );
  }
}

export default User;
