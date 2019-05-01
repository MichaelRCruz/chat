import React, { Component } from 'react';
import './AuthModal.css';

class AuthModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newNameText: ''
    };
  }

  handleNameChange = (event) => {
    if (event.target.value.length >= 25) {
      alert("Please enter some text between 1 and 20 characters in length. :)");
      return;
    } else {
      this.setState({
        newNameText: event.target.value
      });
    }
  }

  signIn(firebase) {
    firebase.auth().signInWithPopup( new firebase.auth.GoogleAuthProvider() );
  }

  signOut(firebase) {
    firebase.auth().signOut();
  }

  handleNameChange = (event) => {
    if (event.target.value.length >= 25) {
      alert("Please enter some text between 1 and 20 characters in length. :)");
      return;
    } else {
      this.setState({
        newNameText: event.target.value
      });
    }
  }

  createName = (name) => {
    console.log('muh name: ', name);
  }

  render() {
    return (
      <section>
        <div className="oauthContainer" onClick={ this.props.user ?
            () => this.signOut(this.props.firebase) : this.signIn(this.props.firebase) }>
          <i className="material-icons">power_settings_new</i>
          <p>Sign { this.props.user ? 'out with Google' : 'in with Google' }</p>
        </div>
        <input
          className="submitNameTextField"
          type="text"
          value={ this.state.newNameText }
          onChange={ this.handleNameChange }
          name="newMessageText"
          placeholder="select cool name"
        />
        <button type="submit" className="submitName" type="submit" onClick={() => this.createName(this.state.newNameText)}>
          <i className="material-icons">add</i>
        </button>
      </section>
    );
  }
}

export default AuthModal;
