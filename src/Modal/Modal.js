import React from 'react';
import './Modal.css';

class Modal extends React.Component {
  constructor(props) {
    super(props);
  };

  // componentDidMount() {
  //   window.scrollTo(0, 1);
  //   this.scrollEventCallback();
  //   window.addEventListener('resize', this.scrollEventCallback);
  // };

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.scrollEventCallback, true);
  // };

  // scrollEventCallback = () => {
  //   let vh = window.innerHeight * 0.01;
  //   document.documentElement.style.setProperty('--vh', `${vh}px`);
  // };

  render() {
    const { show, handleClose, children } = this.props;
    const modalCssClass = show ? 'modal display-block' : 'modal display-none';
    return (
      <aside className={modalCssClass}>
        <div className='modalBody'>
          <header className="modalHeader">
            <button className="exitButton" onClick={handleClose}>
              <i className="material-icons clearIcon">clear</i>
            </button>
          </header>
          <main className="modalMain">
            {children}
          </main>
        </div>
      </aside>
    );
  }
};

export default Modal;
