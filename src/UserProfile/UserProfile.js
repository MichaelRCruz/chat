import React from 'react';
import UpdateDisplayNameForm from './UpdateDisplayNameForm';
import Modal from '../Modal/Modal.js';
import './UserProfile.css';

// https://developer.chrome.com/extensions/signedInDevices
class UserProfile extends React.Component {



  render () {
    const { history } = this.props;
    const loadingAnimation = (
      <aside className="modalHeader">
        <button className="exitButton" onClick={() => {
          history.goBack();
        }}>
          <i className="material-icons clearIcon">clear</i>
        </button>
        <div className="loadingAnimation" />
      </aside>
    );
    return (
      <Modal show={true}>
        <div className="userProfileComponent">
          <nav className="nameNav">
            <h1>update profile</h1>
          </nav>
          <nav className="buttonNav">
            <button className="exitButton" onClick={() => {
              history.goBack();
            }}>
              <i className="material-icons clearIcon">clear</i>
            </button>
          </nav>
          <main className="userProfileMain">
            <UpdateDisplayNameForm />
            <button onClick={() => this.signOut()}>click here to sign out</button>
          </main>
        </div>
      </Modal>
    )
  }
}

export default UserProfile;
