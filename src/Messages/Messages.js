import React, { Component } from 'react';
import Message from './Message.js';
import Mention from './Mention.js';
import Direct from './Direct.js';
import Timeago from './../timeago/timeago.js';
import SessionContext from '../SessionContext.js';
import './Messages.css';

import defaultUserImage from './../assets/images/peaceful_potato.png';

const ReactMarkdown = require('react-markdown/with-html');

class Messages extends Component {
  static contextType = SessionContext;
  render() {
    const { messages={}, user={} } = this.context.state;
    const messagesValues = Object.values(messages);
    const messagesPayload = messagesValues.map((msg, i, msgs) => {
      const prevMessage = msgs[i - 1];
      const prevUid = prevMessage ? prevMessage.creator.uid : '';
      return (
        <Message key={i} msg={msg} prevId={prevUid} user={user} />
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
  }
}

export default Messages;
