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
      displayedMessages: [],
      messageCount: 0,
      messages: [],
      mentions: [],
      directs: [],
      cursor: null
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  async componentDidMount() {
    console.log(this.props.activeRoom.key);
    this.registerListeners();
    const { messages, mentions, directs } = await this.getMessages(this.props.activeRoom.key, null, this.props.user.uid);
    const displayedMessages = await this.getMessageMode(messages, mentions, directs, this.props.messageMode);
    const cursor = messages[0] ? messages[0].key : null;
    this.setState({ displayedMessages, messages, mentions, directs, cursor, messageCount: messages.length }, () => {
      this.bottomOfMessages.scrollIntoView();
      this.setScrollListener();
    });
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  getMessageMode = (messages, mentions, directs, messageMode) => {
    let displayedMessages;
    switch (messageMode || 'directs') {
      case 'messages':
        displayedMessages = mentions ? mentions : [];
        break;
      case 'mentions':
        displayedMessages = directs ? directs : [];
        break;
      case 'directs':
        displayedMessages = messages ? messages : [];
        break;
    }
    return displayedMessages;
  }


  setScrollListener = moveOn => {
    const uid = this.props.user.uid;
    window.onscroll = async () => {
      let originalCursorRef;
      if (Math.round(window.pageYOffset) === 0) {
        if (this.cursorRef) originalCursorRef = this.cursorRef;
        const { messages, mentions, directs } = await this.getMessages(null, this.state.messageCount + 100, uid);
        const displayedMessages = this.getMessageMode(messages, mentions, directs, this.props.messageMode);
        const cursor = displayedMessages[0] ? displayedMessages[0].key : null;
        const messageCount = displayedMessages.length;
        await this.setState({displayedMessages, messages, mentions, directs, cursor, messageCount }, () => {
          if (originalCursorRef) originalCursorRef.scrollIntoView();
        });
      }
    };
  }

  getMessages = (roomId, messageCount, uid) => {
    if (!roomId) {
      roomId = this.props.activeRoom.key;
    }
    if (!messageCount) {
      messageCount = 100;
    }
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/getMessages?roomId=${roomId}&messageCount=${messageCount}&uid=${uid}`)
    .then(res => {
      return res.json();
    }).catch(error => {
      console.log(error);
    });
  }

  async componentWillReceiveProps(prevProps, nextProps) {
    if (this.props !== nextProps) {
      const { messageMode, activeRoom, openModals, user } = this.props;
      if (openModals) this.bottomOfMessages.scrollIntoView();
      if (messageMode != prevProps.messageMode) {
        const { messages, mentions, directs } = this.state;
        const displayedMessages = this.getMessageMode(messages, mentions, directs, prevProps.messageMode);
        const cursor = displayedMessages[0] ? displayedMessages[0].key : null;
        const messageCount = displayedMessages.length;
        this.setState({ displayedMessages, messages, mentions, directs, cursor, messageCount }, () => {
          this.bottomOfMessages.scrollIntoView();
          this.setScrollListener();
        });
      } else if (activeRoom.key != prevProps.activeRoom.key) {
        const { messages, mentions, directs } = await this.getMessages(prevProps.activeRoom.key, null, user.uid);
        const displayedMessages = this.getMessageMode(messages, mentions, directs, messageMode);
        this.setState({
          displayedMessages,
          messages,
          mentions,
          directs,
          cursor: messages[0] ? messages[0].key : null,
          messageCount: messages.length
        }, () => {
          this.bottomOfMessages.scrollIntoView();
          this.setScrollListener();
        });
      }
    }
  }

  registerListeners = () => {
    this.messagesRef.orderByChild('sentAt').limitToLast(1).on('child_added', async snapshot => {
      if (snapshot.val().roomId === this.state.activeRoom.key) {
        const { messages, mentions, directs } = await this.getMessages(null, null, this.props.user.uid);
        this.setState({displayedMessages: messages, mentions, directs }, () => {
          this.bottomOfMessages.scrollIntoView();
        });
      }
    });
    this.messagesRef.orderByChild('sentAt').limitToLast(1).on('child_removed', async snapshot  => {
      if (snapshot.val().roomId === this.state.activeRoom.key) {
        const { messages, mentions, directs } = await this.getMessages(null, null, this.props.user.uid);
        this.setState({displayedMessages: messages, mentions, directs }, () => {
          this.bottomOfMessages.scrollIntoView();
        });
      }
    });
  }

  removeMessage(message) {
    this.messagesRef.child(message.key).remove();
  }

  render() {
    const messages = this.state.displayedMessages.map((message, i, messages) => {
      const prevMessage = messages[i - 1];
      const prevUid = prevMessage ? prevMessage.creator.uid : '';
      return (
        <li
          key={message.key}
          className="message"
          ref={message.key === this.state.cursor ? el => this.cursorRef = el : null}
        >
          <div className="imageMessageContainer">
            <img
              className={"messageImage " + (prevUid !== message.creator.uid ? '' : 'visibilityHidden')}
              alt="user"
              src={message.creator && message.creator.photoURL
              ? message.creator.photoURL : defaultUserImage}
             />
            <div className="nameMessageContainer">
              <div className="display-name">
                {message.creator.displayName}
                {message.creator && this.props.user && message.creator.email === this.props.user.email &&
                  <button
                    onClick={ () => this.removeMessage(message) }
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
        <ul className="messageList">
          {this.props.user ? messages : []}
          <div ref={thisDiv => this.bottomOfMessages = thisDiv}></div>
        </ul>
      </div>
    );
  }
}

export default Messages;
