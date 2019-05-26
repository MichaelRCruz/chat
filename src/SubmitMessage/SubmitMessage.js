import React, { Component } from 'react';
// import SubmitMessageForm from './SubmitMessageForm';
import {reduxForm, Field, reset} from 'redux-form';
import Textarea from '../Input/Textarea';
import {required, nonEmpty, isTrimmed, mdTitle, mdBullet, codeBlock, otherThing} from '../validators';

import './SubmitMessage.css';

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessageText: ''
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  submitMessage(message) {
    if (!this.props.activeRoom) {
      return;
    } else {
      const ref = this.messagesRef.push();
      const key = ref.key;
      const yourData = {
        key: ref.key,
        content: message,
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
        this.props.dispatch(reset('message'));
        if (this.props.firebase.messaging.isSupported()) this.detectUserAndSendMessage(message);
        const textarea = window.document.querySelector("textarea");
        textarea.style.height = '1.5em';
      });
    }
  }

  detectUserAndSendMessage = message => {
    const words = message.split(' ');
    const roomSubscribers = Object.values(this.props.activeRoom.users || {});
    const usersToMessage = [];
    words.forEach(word => {
      const user = word.replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
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
  }

  handleKeyDown = (event, handleSubmit) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      handleSubmit();
    }
  }

  handleTextAreaChange = () => {
    const textarea = window.document.querySelector("textarea");
    textarea.style.height = 0;
    textarea.style.height = textarea.scrollHeight + "px";
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <div className="footerContainer">
        <form
          onSubmit={this.props.handleSubmit(values =>
            this.submitMessage(values.message)
          )}
          onKeyDown={e => {this.handleKeyDown(e, handleSubmit(values => {
            this.submitMessage(values.message);
          }));
        }}>
            <fieldset>
              <legend>😎😎😎</legend>
              <div className="formButtonWrapper"
                   tabIndex="0">
                <Field
                  name="message"
                  id="message"
                  component={Textarea}
                  validate={[required, nonEmpty, mdTitle, mdBullet, codeBlock, otherThing]}
                  onChange={this.handleTextAreaChange}
                />
                <button className="sendButton"
                        type="submit"
                        disabled={this.props.pristine || this.props.submitting}>
                  <i className="send material-icons">send</i>
                </button>
              </div>
            </fieldset>
        </form>
      </div>
    );
  }
}

// export default Messages;
export default reduxForm({
  form: 'message'
})(Messages);
