import React from 'react';

import './Modal.css';

const Modal = ({ user, firebase, handleClose, show, children, signIn, signOut }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        <button className="exitButton" onClick={handleClose}>
          <i className="material-icons">clear</i>
        </button>
        {children}
      </section>
    </div>
  );
};

export default Modal;
