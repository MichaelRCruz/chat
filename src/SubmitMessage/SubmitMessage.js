import React, { Component } from 'react';

import './SubmitMessage.css';

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessageText: ''
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  handleChange(event) {
    if (event.target.value.length > 200) {
      alert("You have reached the character limit");
      return;
    } else {
      this.setState({newMessageText: event.target.value });
    }
  }

  createMessage(newMessageText) {
    const loggedInUser = {
      email: this.props.user.email,
      displayName: this.props.user.displayName,
      photoURL: this.props.user.photoURL
    }
    const loggedOutUser = {
      email: null,
      displayName: 'Peaceful Potato',
      photoURL: null
    }
    if (!this.props.activeRoom || !newMessageText) { return }
    this.messagesRef.push({
      content: newMessageText,
      sentAt: Date.now(),
      roomId: this.props.activeRoom.key,
      creator: this.props.user ? loggedInUser : loggedOutUser
    });
    this.setState({ newMessageText: '' });
  }

  handleAddRoom(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="footerContainer">
        <input
          className="input-text"
          type="text"
          value={ this.state.newMessageText }
          onChange={ this.handleChange.bind(this) }
          name="newMessageText"
          placeholder="Say something"
        />
        <div className="submitMessage" type="submit" onClick={(e) => {
            e.preventDefault();
            this.createMessage(this.state.newMessageText);
          }
        }>
          <i className="send material-icons">send</i>
        </div>
      </div>
    );
  }
}

export default Messages;
