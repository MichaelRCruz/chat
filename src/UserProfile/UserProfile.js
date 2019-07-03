import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import UpdateDisplayNameForm from './UpdateDisplayNameForm';
import Modal from '../Modal/Modal.js';
import './UserProfile.css';

// https://developer.chrome.com/extensions/signedInDevices
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
      <Modal show={true} handleClose={() => { console.log('sup') }}>
        <section className="userProfileComponent">
          <ChangePasswordForm />
          <UpdateDisplayNameForm />
          <button onClick={() => this.signOut()}>click here to sign out</button>
        </section>
      </Modal>
    )
  }
}

export default UserProfile;
