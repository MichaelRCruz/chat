import React, { Component } from 'react';
import Message from './Message.js';
import ErrorBoundary from '../ErrorBoundary.js';
import Mention from './Mention.js';
import Direct from './Direct.js';
import Timeago from './../timeago/timeago.js';
import SessionContext from '../SessionContext.js';
import './Messages.css';

import defaultUserImage from './../assets/images/peaceful_potato.png';

const ReactMarkdown = require('react-markdown/with-html');

class Messages extends Component {
  deleteMessage = msg => {
    this.context.deleteMessage(msg);
  };
  static contextType = SessionContext;
  render() {
    const { messages, user } = this.context.state;
    const messagesValues = Object.values(messages);
    const messagesPayload = messagesValues.map((msg, i, msgs) => {
      return (
        <ErrorBoundary key={i}>
          <Message
            msg={msg}
            user={user}
            deleteMessage={this.deleteMessage.bind(this)}
          />
        </ErrorBoundary>
      );
    });
    return (
      <div className="messages-component">
        <ul className="messageList">
          {messagesPayload}
          <div ref={thisDiv => this.bottomOfMessages = thisDiv}></div>
        </ul>
      </div>
    );
  };
};

export default Messages;
