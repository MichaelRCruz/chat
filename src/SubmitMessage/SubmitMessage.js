import React, { Component } from 'react';

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
    if (!this.props.activeRoom || !newMessageText) { return }
    this.messagesRef.push({
      content: newMessageText,
      sentAt: Date.now(),
      roomId: this.props.activeRoom.key,
      creator: this.props.user ? {email: this.props.user.email, displayName: this.props.user.displayName, photoURL: this.props.user.photoURL} : {email: null, displayName: 'Timid Tomato', photoURL: null }
    });
    this.setState({ newMessageText: '' });
  }

  render() {
    return (
      <form id="create-message" onSubmit={(e) => {
          e.preventDefault();
          this.createMessage(this.state.newMessageText)
        }
      }>
        <input
          type="text"
          value={ this.state.newMessageText }
          onChange={ this.handleChange.bind(this) }
          name="newMessageText"
          placeholder="Say something"
        />
        <input type="submit" />
      </form>
    );
  }
}

export default Messages;
