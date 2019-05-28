import React from 'react';

import './Modal.css';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='modal-body'>
        <div className="modalTitle">
          <button className="exitButton" onClick={handleClose}>
            <i className="material-icons">clear</i>
          </button>
        </div>
        <div className="modalMain">
          {children}
        </div>
      </section>
    </div>
  );
};

export default Modal;
