import React, { Component } from 'react';
import './Messages.css';

import Message from './Message.js';
import Mention from './Mention.js';
import Direct from './Direct.js';
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
      notifications: [],
      cursor: null
    }
    // this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    // const { user, activeRoom, setNotifications } = this.props;
    // this.registerListeners();
    // const { messages, notifications } = await this.getMessages(this.props.activeRoom.key, null);
    // const displayedMessages = await this.getMessageMode(messages, notifications, this.props.messageMode);
    // this.setState({ displayedMessages, messages, notifications }, () => {
    //   this.bottomOfMessages.scrollIntoView();
    //   this.setScrollListener();
    // });
  }


  // setScrollListener = moveOn => {
  //   window.onscroll = async () => {
  //     let originalCursorRef;
  //     if (Math.round(window.pageYOffset) === 0) {
  //       if (this.cursorRef) originalCursorRef = this.cursorRef;
  //       const { messages, notifications } = await this.getMessages(null, this.state.messageCount + 100);
  //       const displayedMessages = this.getMessageMode(messages, notifications, this.props.messageMode);
  //       const cursor = displayedMessages[0] ? displayedMessages[0].key : null;
  //       const messageCount = displayedMessages.length;
  //       await this.setState({displayedMessages, messages, notifications, cursor, messageCount }, () => {
  //         if (originalCursorRef) originalCursorRef.scrollIntoView();
  //       });
  //     }
  //   };
  // }

  // async componentWillReceiveProps(prevProps, nextProps) {
  //   if (this.props !== nextProps) {
  //     const { messageMode, activeRoom, openModals, user } = this.props;
  //     if (openModals) this.bottomOfMessages.scrollIntoView();
  //     if (messageMode != prevProps.messageMode) {
  //       const { messages, notifications } = this.state;
  //       const displayedMessages = this.getMessageMode(messages, notifications, prevProps.messageMode);
  //       const cursor = displayedMessages[0] ? displayedMessages[0].key : null;
  //       const messageCount = displayedMessages.length;
  //       this.setState({ displayedMessages, messages, notifications, cursor, messageCount }, () => {
  //         this.bottomOfMessages.scrollIntoView();
  //         this.setScrollListener();
  //       });
  //     } else if (activeRoom.key != prevProps.activeRoom.key) {
  //       const { messages, notifications } = await this.getMessages(prevProps.activeRoom.key, null);
  //       const displayedMessages = this.getMessageMode(messages, notifications, messageMode);
  //       this.setState({
  //         displayedMessages,
  //         messages,
  //         notifications
  //       }, () => {
  //         this.bottomOfMessages.scrollIntoView();
  //         this.setScrollListener();
  //       });
  //     }
  //   }
  // }

  render() {
    const messagesValues = Object.values(this.state.displayedMessages);
    const messages = messagesValues.map((message, i, messages) => {
      const prevMessage = messages[i - 1];
      const prevUid = prevMessage ? prevMessage.creator.uid : '';
      return (
        <Message key={message.key} message={message} prevId={prevUid} user={this.props.user} />
      );
    });
    const notifications = this.state.notifications.map((direct, i, notifications) => {
      return (
        <Direct key={direct.key} direct={direct} user={this.props.user} />
      );
    });
    return (
      <div className="messages-component">
        <ul className="messageList">
          {this.props.messageMode === 'notifications' ? messages : []}
          {this.props.messageMode === 'messages' ? notifications : []}
          <div ref={thisDiv => this.bottomOfMessages = thisDiv}></div>
        </ul>
      </div>
    );
  }
}

export default Messages;
