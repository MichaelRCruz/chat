import React, { Component } from 'react';
import Validation from '../validation.js';

import './SubmitMessage.css';

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messageValue: '',
      messageError: '',
      isValidated: false
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  };

  submitMessage = event => {
    event.preventDefault();
    const { messageValue } = this.state;
    if (!this.props.activeRoom) {
      return;
    } else {
      const ref = this.messagesRef.push();
      const yourData = {
        key: ref.key,
        content: messageValue,
        sentAt: Date.now(),
        roomId: this.props.activeRoom.key,
        creator: {
          uid: this.props.user.uid,
          email: this.props.user.email,
          displayName: this.props.user.displayName,
          photoURL: this.props.user.photoURL
        }
      };
      ref.set(yourData, () => {
        if (this.props.firebase.messaging.isSupported()) this.detectUserAndSendMessage(messageValue);
        const textarea = window.document.querySelector(".textarea");
        textarea.style.height = '1.4em';
        this.setState({ messageValue: '', messageError: '', isValidated: false });
      });
    }
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      this.submitMessage(event);
    }
  };

  detectUserAndSendMessage = message => {
    const words = message.split(' ');
    const roomSubscribers = Object.values(this.props.activeRoom.users || {});
    const usersToMessage = [];
    words.forEach(word => {
      let user = word.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>{}[]\\\/]/gi, '');
      user = user.replace(/@/g,'');
      if (word.startsWith('@') && roomSubscribers.includes(user)) {
        usersToMessage.push(user);
      }
    });
    if (usersToMessage.length) {
      return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/sendMessageToUser`, {
        method: 'POST',
        body: JSON.stringify({ displayNames: usersToMessage, message })
      }).then(response => {
        return response;
      }).catch(error => {
        return error;
      });
    }
  };

  formValidated = () => {
    const { messageValue, messageError } = this.state;
    const hasErrors = messageError.length ? true : false;
    const hasValues = messageValue.length ? true : false;
    this.setState({ isValidated: !hasErrors && hasValues });
  };

  handleFieldValue = validationResponse => {
    this.setState({
      [validationResponse[0]]: validationResponse[1]
    }, this.formValidated );
  };

  validateMessage = messageValue => {
    const textarea = window.document.querySelector(".textarea");
    textarea.style.height = 0;
    textarea.style.height = textarea.scrollHeight + "px";
    this.setState({ messageValue }, () => {
      this.handleFieldValue(new Validation().message(messageValue));
    });
  };

  render() {
    return (
      <div className="footerContainer">
        <form
          className=""
          onSubmit={e => this.submitMessage(e)}
          onKeyDown={e => this.handleKeyDown(e)}>
            <div className="formButtonWrapper" tabIndex="0">
              <textarea
                className="textarea"
                name="message"
                type="textarea"
                placeholder='message'
                value={this.state.messageValue}
                onChange={e => this.validateMessage(e.target.value)}
              />
              <button
                onClick={(e) => this.submitMessage(e)}
                className="sendButton"
                type="submit"
                disabled={!this.state.isValidated}>
                <i className="send material-icons">send</i>
              </button>
            </div>
        </form>
      </div>
    );
  }
}

export default Messages;
