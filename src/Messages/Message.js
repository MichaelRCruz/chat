import React, { Component } from 'react';
import './Messages.css';

import Timeago from './../timeago/timeago.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';

const ReactMarkdown = require('react-markdown/with-html');

class Message extends Component {
  constructor (props) {
    super(props);
  }

  // removeMessage(message) {
  //   this.messagesRef.child(message.key).remove();
  // }

  render() {
    const { msg, user, prevUid } = this.props;
    return (
      <li className="message">
        <div className="imageMessageContainer">
          <img
            className={"messageImage " + (prevUid !== msg.creator.uid ? '' : 'visibilityHidden')}
            alt="user"
            src={msg.creator && msg.creator.photoURL
            ? msg.creator.photoURL : defaultUserImage}
           />
          <div className="nameMessageContainer">
            <div className="display-name">
              {msg.creator.displayName}
              {msg.creator && user && msg.creator.email === user.email &&
                <button
                  onClick={ () => this.removeMessage(msg) }
                  className="remove-message-button">
                  &times;
                </button>
              }
            </div>
            <div className="content">
              <ReactMarkdown escapeHtml={false} source={msg.content} />
            </div>
          </div>
        </div>
        <Timeago className="timeago" timestamp={ msg.sentAt || 'sometime' } />
      </li>
    )
  }
}

export default Message;
