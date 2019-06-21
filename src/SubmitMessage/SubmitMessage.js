import React, { Component } from 'react';
import SessionContext from '../SessionContext.js';
import Validation from '../validation.js';
import './SubmitMessage.css';

class Messages extends Component {
  state = {
    messageValue: '',
    messageError: '',
    isValidated: false
  };
  submitMessage = event => {
    event.preventDefault();
    const textarea = window.document.querySelector(".textarea");
    textarea.style.height = '1.5em';
    this.context.submitMessage(this.state.messageValue);
    this.setState({ messageValue: '' });
  };
  handleKeyDown = event => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      this.context.submitMessage(this.state.messageValue);
      this.setState({ messageValue: '' });
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
  static contextType = SessionContext;
  render() {
    const { isValidated, messageValue } = this.state;
    return (
      <div className="footerContainer">
        <form
          className=""
          onSubmit={e => this.submitMessage(e)}
          onKeyDown={e => this.handleKeyDown(e)}>
            <div className="formButtonWrapper">
              <button
                className="sendButton"
                onClick={e => {
                  e.preventDefault();
                }}>
                <i className="notification material-icons">chat</i>
              </button>
              <textarea
                className="textarea"
                name="message"
                type="textarea"
                placeholder='message'
                value={messageValue}
                onChange={e => this.validateMessage(e.target.value)}
              />
              <button
                className="sendButton"
                onClick={e => this.submitMessage(e)}
                type="submit"
                disabled={isValidated}>
                <i className="send material-icons">send</i>
              </button>
            </div>
        </form>
      </div>
    );
  }
}

export default Messages;
