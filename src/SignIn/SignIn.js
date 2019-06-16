import React, {Fragment} from 'react';
import Auth from '../Auth/Auth.js';
import SessionContext from '../SessionContext.js';
import './SignIn.css';

class Waiting extends React.Component  {

  static defaultProps = {
    session: {}
  };
  static contextType = SessionContext;

  state = {
    showAuthModal: true
  };

  toggleAuthModal = () => {
    this.setState({ showAuthModal: !this.state.showAuthModal });
  };

  componentDidMount() {

  };

  render() {
    const { inWaiting } = this.context;
    const auth = (
      <Auth
          firebase={this.props.firebase}
          toggleAuthModal={this.toggleAuthModal.bind(this)}
        />
    );
    return (
      <React.Fragment>
        { this.state.showAuthModal ? auth : null }
        { inWaiting ? null : null }
      </React.Fragment>
    )
  };
};

export default Waiting;
