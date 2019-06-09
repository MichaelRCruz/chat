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
      mentions: [],
      directs: [],
      cursor: null
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  async componentDidMount() {
    this.registerListeners();
    const { messages, mentions, directs } = await this.getMessages(null, null, this.props.user.uid);
    const displayedMessages = await this.getMessageMode(messages, mentions, directs);
    this.setState({
      displayedMessages: displayedMessages || [],
      messages: messages || [],
      mentions: mentions || [],
      directs: directs || [],
      cursor: messages[0] ? messages[0].key : null,
      messageCount: messages.length
    }, () => {
      this.bottomOfMessages.scrollIntoView();
      this.setScrollListener();
    });
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  getMessageMode = (messages, mentions, directs) => {
    let displayedMessages;
    const messageMode = this.props.messageMode;
    switch (messageMode) {
      case 'messages':
        displayedMessages = mentions;
        break;
      case 'mentions':
        displayedMessages = directs;
        break;
      case 'directs':
        displayedMessages = messages;
        break;
    }
    return displayedMessages;
  }


  setScrollListener = () => {
    const uid = this.props.user.uid;
    window.onscroll = async () => {
      // const cursorPosition = _self.cursorRef.getBoundingClientRect().bottom);
      let originalCursorRef;
      if (Math.round(window.pageYOffset) === 0) {
        if (this.cursorRef) originalCursorRef = this.cursorRef;
        const { messages, mentions, directs } = await this.getMessages(null, this.state.messageCount + 100, uid);
        const displayedMessages = this.getMessageMode(messages, mentions, directs);
        this.setState({
          displayedMessages: displayedMessages || [],
          messages: messages || [],
          mentions: mentions || [],
          directs: directs || [],
          cursor: messages[0] ? messages[0].key : null,
          messageCount: messages.length
        }, () => {
          if (originalCursorRef) originalCursorRef.scrollIntoView();
        });
      }
    };
  }

  getMessages = (roomId, messageCount, uid) => {
    if (!roomId) {
      roomId = this.state.activeRoom.key;
    }
    if (!messageCount) {
      messageCount = 100;
    }
    return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/getMessages?roomId=${roomId}&messageCount=${messageCount}&uid=${uid}`, {
    }).then(res => {
      return res.json();
    }).catch(error => {
      console.log(error);
    });
  }

  async componentWillReceiveProps(prevProps, nextProps) {
    if (this.props !== nextProps) {
      const { messages, mentions, directs } = await this.getMessages(prevProps.activeRoom.key, null, this.props.user.uid);
      const displayedMessages = await this.getMessageMode(messages, mentions, directs);
      await this.setState({
        displayedMessages: displayedMessages || [],
        messages: messages || [],
        mentions: mentions || [],
        directs: directs || [],
        cursor: messages[0] ? messages[0].key : null,
        messageCount: messages.length
      }, () => {
        this.bottomOfMessages.scrollIntoView();
        this.setScrollListener();
      });
    }
  }

  registerListeners = () => {
    this.messagesRef.orderByChild('sentAt').limitToLast(1).on('child_added', async snapshot => {
      if (snapshot.val().roomId === this.state.activeRoom.key) {
        const response = await this.getMessages(null, null, this.props.user.uid);
        this.setState({displayedMessages: response.messages}, () => {
          this.bottomOfMessages.scrollIntoView();
        });
      }
    });
    this.messagesRef.orderByChild('sentAt').limitToLast(1).on('child_removed', async snapshot  => {
      if (snapshot.val().roomId === this.state.activeRoom.key) {
        const response = await this.getMessages(null, null, this.props.user.uid);
        this.setState({displayedMessages: response.messages});
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
