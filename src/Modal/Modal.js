import React from 'react';
import './Modal.css';

const Modal = ({ handleClose, show, children }) => {
  const modalCssClass = show ? 'modal display-block' : 'modal display-none';

  return (
    <aside className={modalCssClass}>
      <div className='modal-body'>
        <header className="modalTitle">
          <button className="exitButton" onClick={handleClose}>
            <i className="material-icons">clear</i>
          </button>
        </header>
        <main className="modalMain">
          {children}
        </main>
      </div>
    </aside>
  );
};

export default Modal;
