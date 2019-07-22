import React, { useContext, useEffect, useState } from 'react';
import SessionContext from '../SessionContext.js';
import useForm from '../Auth/useForm.js';
import Validation from '../validation.js';
import './SubmitMessage.css';

const Messages = () => {

  const submitMessage = (payload, event, clearForm) => {
    event.preventDefault();
    sessionContext.submitMessage(payload.message);
    // clear()
    const textarea = window.document.querySelector(".textarea");
    textarea.style.height = '1.5em';
    clearForm({});
  };

  const { handleSubmit, handleChange, ...formState } = useForm(submitMessage);
  const [isMessageValidated, setIsMessageValidated] = useState(false);
  const [message, setMessage] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [warning, setWarning] = useState(false);
  const sessionContext = useContext(SessionContext);

  const { wasFormSubmitted, setWasFormSubmitted, formErrors, formValues } = formState;

  const handleKeyDown = event => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      // event.preventDefault();
      handleSubmit(event);
    }
  }

  useEffect(() => {
    const textarea = window.document.querySelector(".textarea");
    textarea.style.height = 0;
    textarea.style.height = textarea.scrollHeight + "px";
    return () => {
      // console.log(formValues.message);
    }
  }, [formErrors, formValues]);

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
