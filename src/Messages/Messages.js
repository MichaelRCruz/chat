import React, { Component } from 'react';
import './Messages.css';

import Timeago from './../timeago/timeago.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      allMessages: [],
      displayedMessages: []
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.watchFirebaseForMessages();
    this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    this.updateDisplayedMessages( nextProps.activeRoom );
  }

  removeMessage(room) {
    this.messagesRef.child(room.key).remove();
  }

  scrollToBottom() {
    this.bottomOfMessages.scrollIntoView();
  }

  updateDisplayedMessages(activeRoom) {
    if (!activeRoom) { return }
    this.setState({
      displayedMessages: this.state.allMessages.filter(message => {
        return message.roomId === activeRoom.key;
      })
    }, () => this.scrollToBottom());
  }

  watchFirebaseForMessages() {
    const allMessages = [];
    const throttler = this.throttling(() => {
      this.setState({allMessages: allMessages.slice(0)}, () => {
        this.updateDisplayedMessages(this.props.activeRoom);
        this.scrollToBottom();
      });
    }, 100);
    this.messagesRef.on('child_added', snapshot => {
      let message = Object.assign(snapshot.val(), {key: snapshot.key});
      allMessages.push(message);
      throttler();
    });
    this.messagesRef.on('child_removed', snapshot  => {
      this.setState({ allMessages: this.state.allMessages.filter( message => message.key !== snapshot.key )  }, () => {
        this.updateDisplayedMessages(this.props.activeRoom);
      });
    });
  }

  throttling(callback, delay) {
    let timeout = null
    return function(...args) {
      if (!timeout) {
        timeout = setTimeout(() => {
          callback.call(this, ...args)
          timeout = null
        }, delay)
      }
    }
  }

  render() {
    const messages = this.state.displayedMessages.map( message =>
      <li key={message.key} className="message">
        <div className="imageMessageContainer">
          <img
            className="messageImage"
            alt="user"
            src={message.creator && message.creator.photoURL
            ? message.creator.photoURL : defaultUserImage }
           />
          <div>
            <div className="display-name">
              {message.creator ? message.creator.displayName  : 'Peaceful Potato'}
              {message.creator && this.props.user && message.creator.email === this.props.user.email &&
                <button onClick={ () => this.removeMessage(message) }
                        className="remove-message-button">
                  &times;
                </button>
              }
            </div>
            <div className="content">{message.content}</div>
          </div>
        </div>
        <Timeago className="timeago" timestamp={ message.sentAt || 'sometime' } />
      </li>
    )
    return (
      <div className="messages-component">
        <ul className="message-list">
          {messages}
          <div ref={(thisDiv) => this.bottomOfMessages = thisDiv}></div>
        </ul>
      </div>
    );
  }
}

export default Messages;
