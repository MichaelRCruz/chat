import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
      displayedMessages: [],
      messageCount: 200,
      cursor: null
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    let _self = this;
    const cursor = this.state.cursor;
    this.registerListeners();
    this.getMessages().then(messages => {
      this.setState({ displayedMessages: messages, cursor: messages[0].key, messageCount: messages.length }, () => {
        this.bottomOfMessages.scrollIntoView();
        this.setScrollListener();
      });
    });
  }

  setScrollListener = () => {
    const _self = this;
    window.onscroll = function() {
      if (window.pageYOffset === 0) {
        const ref = _self.cursorRef;
        _self.getMessages(null, _self.state.messageCount + 200).then(messages => {
          _self.setState({
            displayedMessages: messages,
            cursor: messages[0] ? messages[0].key : null,
            messageCount: messages.length
          }, () => {
            if (ref) ref.scrollIntoView();
            window.scrollBy(0, -400);
          });
        });
      }
    };
  }

  getMessages = (roomId, messageCount) => {
    if (!roomId) {
      roomId = this.state.activeRoom.key;
    }
    if (!messageCount) {
      messageCount = 200;
    }
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/getMessages?roomId=${roomId}&messageCount=${messageCount}`, {
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
      this.getMessages(prevProps.activeRoom.key).then(messages => {
        const foo = messages.slice(300);
        this.setState({ displayedMessages: messages, activeRoom: prevProps.activeRoom }, () => {
          this.bottomOfMessages.scrollIntoView();
        });
      });
    }
  }

  registerListeners = () => {
    this.messagesRef.orderByChild('sentAt').limitToLast(1).on('child_added', snapshot => {
      if (snapshot.val().roomId === this.state.activeRoom.key) {
        const messages = this.state.displayedMessages;
        this.setState({
          displayedMessages: messages.concat([snapshot.val()])
        }, () => this.bottomOfMessages.scrollIntoView());
      }
    });
    this.messagesRef.orderByChild('sentAt').limitToLast(1).on('child_removed', async snapshot  => {
      if (snapshot.val().roomId === this.state.activeRoom.key) {
        const filteredMessages = this.state.displayedMessages.filter(message => {
          return message.key !== snapshot.val().key;
        });
        const messages = await this.getMessages();
        this.setState({displayedMessages: messages});
      }
    });
  }

  removeMessage(message) {
    console.log(message.key, message);
    this.messagesRef.child(message.key).remove();
  }

  // throttling(callback, delay) {
  //   let timeout = null
  //   return function(...args) {
  //     if (!timeout) {
  //       timeout = setTimeout(() => {
  //         callback.call(this, ...args)
  //         timeout = null
  //       }, delay)
  //     }
  //   }
  // }

  render() {
    const messages = this.state.displayedMessages.map((message, i, messages) => {
      const prevMessage = messages[i - 1];
      const prevUid = prevMessage ? prevMessage.creator.uid : '';
      return (
        <li key={message.key}
            className="message"
            ref={message.key === this.state.cursor ? el => this.cursorRef = el : null}
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
