import React, { Component } from 'react';
import './Messages.css';

import Timeago from './../timeago/timeago.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';

const ReactMarkdown = require('react-markdown/with-html');

class Message extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const { message, user, prevUid } = this.props;
    return (
      <li key={message.key} className="message">
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
    )
  }
}

export default Message;
