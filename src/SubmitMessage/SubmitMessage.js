import React, { useContext, useEffect, useState } from 'react';
import SessionContext from '../SessionContext.js';
import useForm from '../Auth/useForm.js';
import Validation from '../validation.js';
import './SubmitMessage.css';

const Messages = props => {

  const submitMessage = (payload, event, clearForm) => {
    event.preventDefault();
    sessionContext.submitMessage(payload.message);
    detectUserAndSendMessage(payload.message);
    const textarea = window.document.querySelector(".textarea");
    textarea.style.height = '1.5em';
    clearForm({});
  };

  const { handleSubmit, handleChange, ...formState } = useForm(submitMessage);
  const [isMessageValidated, setIsMessageValidated] = useState(false);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [warning, setWarning] = useState(false);
  const [tokens, setTokens] = useState([]);
  const sessionContext = useContext(SessionContext);
  const { activeRoom } = sessionContext.state;

  const { setWasFormSubmitted, formErrors, formValues } = formState;

  const handleKeyDown = event => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      handleSubmit(event);
    }
  };

  const detectUserAndSendMessage = message => {
    const words = message.split(' ');
    const usersKeys = Object.keys(activeRoom.users);
    if (usersKeys.length) {
      return fetch(`https://us-central1-chat-asdf.cloudfunctions.net/sendMessageToUser`, {
        method: 'POST',
        body: JSON.stringify({ usersKeys, message, sender })
      }).then(response => {
        return response;
      }).catch(error => {
        return error;
      });
    }
  };

  useEffect(() => {
    const textarea = window.document.querySelector(".textarea");
    textarea.style.height = 0;
    textarea.style.height = textarea.scrollHeight + "px";

    const _sender = {...props};
    setSender(_sender);

    let muhTokens = [];
    if (activeRoom) for (const user in activeRoom.users) {
      muhTokens.push(user.fcmToken);
      setTokens(muhTokens);
    }
    return () => {
      // console.log(formValues.message);
    }
  }, [formErrors, formValues, activeRoom]);

  return (
    <div className="footerContainer">
      <form
        onSubmit={(e) => handleSubmit(e)}
        onKeyDown={(e) => handleKeyDown(e)}>
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
              value={formValues.message || ''}
              onChange={handleChange}
            />
            <button
              className="sendButton"
              type="submit"
              disabled={isMessageValidated}
              onClick={(e) => handleSubmit(e)}>
              <i className="send material-icons">send</i>
            </button>
          </div>
      </form>
    </div>
  );
}

export default Messages;
