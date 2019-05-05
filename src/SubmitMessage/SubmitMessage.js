import React, { Component } from 'react';
// import SubmitMessageForm from './SubmitMessageForm';
import {reduxForm, Field} from 'redux-form';
import Textarea from '../Input/Textarea';
import {required, nonEmpty, isTrimmed} from '../validators';

import './SubmitMessage.css';

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessageText: ''
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  // handleChange(event) {
  //   if (event.target.value.length >= 1000) {
  //     alert("Please enter some text between 1 and 500 characters in length. :)");
  //     return;
  //   } else {
  //     this.setState({newMessageText: event.target.value });
  //   }
  // }

  componentDidMount() {
    let textarea = window.document.querySelector("textarea");
    textarea.addEventListener("keypress", function() {
      if(textarea.scrollTop != 0){
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
          email: this.props.user.email,
          displayName: this.props.user.displayName,
          photoURL: this.props.user.photoURL
        } : {
          email: null,
          displayName: 'Peaceful Potato',
          photoURL: null
        }
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
              <legend>say something</legend>
              <div className="formButtonWrapper">
                <Field
                  name="message"
                  id="message"
                  component={Textarea}
                  validate={[required, nonEmpty]}
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
