import React, { Component } from 'react';

import './SubmitMessage.css';

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessageText: '',
      // activeRoom: {}
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
    // this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  // componentDidMount() {
  //   this.roomsRef.on('child_added', snapshot => {
  //     const room = snapshot.val();
  //     room.key = snapshot.key;
  //     this.setState({ activeRoom: room.key });
  //   });
  // }

  handleChange(event) {
    if (event.target.value.length > 200) {
      alert("You have reached the character limit");
      return;
    } else {
      this.setState({newMessageText: event.target.value });
    }
  }

  createMessage(newMessageText) {
    // const loggedInUser = {
    //   email: this.state.user.email,
    //   displayName: this.state.user.displayName,
    //   photoURL: this.state.user.photoURL
    // }
    // const loggedOutUser = {
    //   email: null,
    //   displayName: 'Peaceful Potato',
    //   photoURL: null
    // }
    if (!this.props.activeRoom || !newMessageText) { return }
    this.messagesRef.push({
      content: newMessageText,
      sentAt: Date.now(),
      roomId: this.state.activeRoom.key,
      creator: this.state.user ? {
        email: this.state.user.email,
        displayName: this.state.user.displayName,
        photoURL: this.state.user.photoURL
      } : {
        email: null,
        displayName: 'Peaceful Potato',
        photoURL: null
      }
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
          <i className="material-icons">add</i>
        </div>
      </div>
    );
  }
}

export default Messages;
