import React, { Component } from 'react';

import './SubmitMessage.css';

const ReactDOM = require('react-dom')
const ReactMarkdown = require('react-markdown')

var showdown  = require('showdown'),
    converter = new showdown.Converter(),
    text      = '# hello, markdown!',
    myHtml      = converter.makeHtml(text);

class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newMessageText: ''
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  handleChange(event) {
    if (event.target.value.length >= 500) {
      alert("Please enter some text between 1 and 500 characters in length. :)");
      return;
    } else {
      this.setState({newMessageText: event.target.value });
    }
  }

  createMessage(newMessageText) {
    if (newMessageText === '\n') {
      alert('Please enter a message to send. ;)');
      this.setState({ newMessageText: '' });
      return;
    } else if (!this.props.activeRoom || !newMessageText) {
      return
    } else {
      this.messagesRef.push({
        content: newMessageText,
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
      this.setState({ newMessageText: '' });
    }
  }

  handleEnterDown = (event) => {
    if (event.key === 'Enter') {
      this.createMessage(this.state.newMessageText);
    }
  }

  handleAddRoom(e) {
    e.preventDefault();
  }

  render() {
    return (
      <form className="footerContainer" onSubmit={(e) => {
          e.preventDefault();
          this.createMessage(this.state.newMessageText);
        }
      }>
        <textarea
          className="input-text"
          type="text"
          value={ this.state.newMessageText }
          onChange={ this.handleChange.bind(this) }
          name="newMessageText"
          placeholder="Say something"
          onKeyPress={this.handleEnterDown}

        />
        <button type="submit" className="submitMessage" type="submit">
          <i className="send material-icons">send</i>
        </button>
      </form>
    );
  }
}

export default Messages;
