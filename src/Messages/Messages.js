import React, { Component } from 'react';
import Message from './Message.js';
import ErrorBoundary from '../ErrorBoundary.js';
// import Timeago from './../timeago/timeago.js';
import SessionContext from '../SessionContext.js';
// import { staticMessages } from '../staticState.js';
import './Messages.css';

// import defaultUserImage from './../assets/images/peaceful_potato.png';

// const ReactMarkdown = require('react-markdown/with-html');

class Messages extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef()
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    this.bottomOfMessages.scrollIntoView();
  }
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
          <li>
            <Message
              msg={msg}
              user={user}
              deleteMessage={this.deleteMessage.bind(this)}
            />
          </li>
        </ErrorBoundary>
      );
    });
    return (
      <div className="messages-component">
        <ul className="messageList">
          {messagesPayload}
        </ul>
        <div ref={(thisDiv) => this.bottomOfMessages = thisDiv}></div>
      </div>
    );
  };
};

export default Messages;
