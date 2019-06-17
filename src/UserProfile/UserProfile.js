import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateDisplayNameForm from './UpdateDisplayNameForm';
import './UserProfile.css';

class UserProfile extends React.Component {


  signOut = async () => {
    const { firebase, userConfig } = this.props;
    const uid = await firebase.auth().currentUser.uid;
    firebase.auth().signOut()
    .then(() => {
      if (userConfig.currentFcmToken) {
        return this.props.handleFcmToken(userConfig.currentFcmToken, uid, false);
      }
    });
  };

  updatePassword = password => {
    var user = this.props.firebase.auth().currentUser;
    user.updatePassword(password)
    .then(res => {
      this.props.toggleModal();
      alert('password updated successfully: ');
    })
    .catch(error => {
      alert(error);
    });
  };

  updateDisplayName = displayName => {
    var user = this.props.firebase.auth().currentUser;
    user.updateProfile({ displayName })
    .then(res => {
      console.log(res);
      this.props.toggleModal();
    })
    .catch(error => {
      alert(error.messsage);
    });
  };

  deleteUser = () => {
    const user = this.props.firebase.auth().currentUser;
    user.delete()
    .then(res => {
      console.log('deleted user: ', res);
      this.props.toggleModal();
    })
    .catch(function(error) {
      console.log('error in deleting user: ', error);
      alert(error);
    });
  };

  sendEmailVerification = () => {
    const user = this.props.firebase.auth().currentUser;
    user.sendEmailVerification()
    .then(res => {
      this.props.toggleModal();
    })
    .catch(function(error) {
      console.log(error.message);
    });
  };

  render () {
    return (
      <section className="userProfileComponent">
        <ChangePasswordForm updatePassword={this.updatePassword.bind(this)}/>
        <UpdateDisplayNameForm updateDisplayName={this.updateDisplayName.bind(this)}/>
        <button onClick={() => this.signOut()}>click here to sign out</button>
      </section>
    )
  }
}

export default UserProfile;
