import React from 'react';
import './Waiting.css';

class Waiting extends React.Component  {

  render() {
    return (
      <section className="waitingComponent">
        <p>Please check your email for a special sign in link and click to complete the authentication process. We'll be here when you're done :)</p>
      </section>
    )
  };
};

export default Waiting;
