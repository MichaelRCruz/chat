import React, { Component } from 'react';
import './Messages.css';

import Timeago from './../timeago/timeago.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';

const ReactMarkdown = require('react-markdown/with-html');


class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeRoom: props.activeRoom,
      userConfig: null,
      allMessages: [],
      displayedMessages: [],
      messageDeleted: false
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    // this.watchFirebaseForMessages();
    this.getMessages().then(messages => {
      messages.forEach(message => {
        message.roomId = this.state.activeRoom.key;
      });
      this.setState({ displayedMessages: messages });
      this.scrollToBottom();
    });
  }

  getMessages = roomId => {
    if (!roomId) {
      roomId = this.state.activeRoom.key;
    }
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/getMessages?roomId=${roomId}`, {
      }).then(res => {
        return res.json();
      }).then(data => {
        return data;
      }).catch(error => {
        console.log(error);
      });
  }

  componentWillReceiveProps(prevProps, nextProps) {
    if (this.props != nextProps) {
      // this.watchFirebaseForMessages();
      // this.scrollToBottom();
      // console.log(prevProps);
      this.getMessages(prevProps.activeRoom.key).then(messages => {
        messages.forEach(message => {
          message.roomId = this.state.activeRoom.key;
        });
        this.setState({ displayedMessages: messages });
        this.scrollToBottom();
      });
    }
  }

  removeMessage(room) {
    this.setState({ messageDeleted: !this.state.messageDeleted }, () => {
      this.messagesRef.child(room.key).remove();
    });
  }

  scrollToBottom() {
    this.bottomOfMessages.scrollIntoView();
  }

  updateDisplayedMessages() {
    // if (!activeRoom) { return };
    const roomMessages = this.state.allMessages.filter(message => {
      return message.roomId === this.props.activeRoom.key;
    });
    this.setState({
      messageDeleted: true,
      displayedMessages: roomMessages
    }, () => this.scrollToBottom());
  }

  watchFirebaseForMessages() {
    const allMessages = [];
    const throttler = this.throttling(() => {
      this.setState({allMessages: allMessages.slice(0)}, () => {
        this.updateDisplayedMessages();
      });
    }, 100);
    this.messagesRef.on('child_added', snapshot => {
      let message = Object.assign(snapshot.val(), {key: snapshot.key});
      allMessages.push(message);
      throttler();
    });
    this.messagesRef.on('child_removed', snapshot  => {
      this.watchFirebaseForMessages();
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
    const messages = this.state.displayedMessages.map((message, i, messages) => {
      const prevMessage = messages[i - 1];
      const prevUid = prevMessage ? prevMessage.creator.uid : '';
      return (
        <li key={message.key}
            className="message"
        >
          <div className="imageMessageContainer">
            <img
              className={"messageImage " + (prevUid != message.creator.uid ? '' : 'visibilityHidden')}
              alt="user"
              src={message.creator && message.creator.photoURL
              ? message.creator.photoURL : defaultUserImage}
             />

            <div className="nameMessageContainer">
              <div className="display-name">
                {message.creator.displayName}
                {message.creator && this.props.user && message.creator.email === this.props.user.email &&
                  <button onClick={ () => this.removeMessage(message) }
                          className="remove-message-button">
                    &times;
                  </button>
                }
              </div>
              <div className="content">
                <ReactMarkdown escapeHtml={false} source={message.content} />
              </div>
            </div>
          </div>
          <Timeago className="timeago" timestamp={ message.sentAt || 'sometime' } />
        </li>
      )}
    )
    return (
      <div className="messages-component">
        <ul className="message-list">
          {this.props.user ? messages : []}
          <div ref={(thisDiv) => this.bottomOfMessages = thisDiv}></div>
        </ul>
      </div>
    );
  }
}

export default Messages;
