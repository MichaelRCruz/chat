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

  componentDidMount() {
    // const roomId = this.props.activeRoom.key;
    const textarea = window.document.querySelector("textarea");
    textarea.addEventListener('keypress', () => {
      const roomId = this.props.activeRoom.key;
      if (textarea.scrollTop != 0){
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }, false);
  }

  submitMessage(message) {
    if (!this.props.activeRoom) {
      return
    } else {
      this.messagesRef.push({
        content: message,
        sentAt: Date.now(),
        roomId: this.props.activeRoom.key,
        creator: this.props.user ? {
          uid: this.props.user.uid,
          email: this.props.user.email,
          displayName: this.props.user.displayName,
          photoURL: this.props.user.photoURL
        } : {
          email: null,
          displayName: 'Peaceful Potato',
          photoURL: null
        }
      }).then(res => {
        this.props.dispatch(reset('message'));
      });
    }
  }

  // handleEnterDown = (event) => {
  //   if (event.key === 'Enter') {
  //     this.submitMessage(this.state.newMessageText);
  //   }
  // }

  render() {
    return (
      <div className="footerContainer">
        <form
          onSubmit={this.props.handleSubmit(values =>
              this.submitMessage(values.message)
          )}>
            <fieldset>
              <legend>😎😎😎</legend>
              <div className="formButtonWrapper">
                <Field
                  name="message"
                  id="message"
                  component={Textarea}
                  validate={[required, nonEmpty, mdTitle, mdBullet, codeBlock, otherThing]}
                />
                <button className="sendButton" type="submit">
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
