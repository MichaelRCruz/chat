import React from 'react';
import './Splash.css';

class Splash extends React.Component  {

  redirectToSignIn = () => {
    this.props.history.push('/signIn');
  }

  componentDidMount() {
    // window.scrollTo(0, 1);
  };

  render() {
    return (
      <div className="splashComponent">
        <header className="splashHeader">
          <div className="headerContentContainer">
            <a className="anchor" href="https://michaelcruz.io/chat">
              <div className="nameLogoContainer">
                <img className="splashLogo" src={require("../assets/images/potato2.svg")}
                     alt="potato logo"
                />
                <p className="splashAppName">Potato</p>
              </div>
            </a>
            <i onClick={this.redirectToSignIn} className="material-icons menuIcon">menu</i>
          </div>
        </header>
        <main className="splashMain">
          <div className="mainContentContainer">
            <h1 className="hero">
              Live chat with anyone, simplified.
            </h1>
            <p className="appDescription">
              Welcome to your new live chat application! Share your thoughts and ideas with anybody, anywhere. Click the link below to get started.
            </p>
            <button className="getStartedButton" onClick={this.redirectToSignIn}>GET STARTED</button>
          </div>
          <div className="companyImagesContainer">
            <img className="firebaseLogo" alt="" src={require("../assets/Built_with_Firebase_Logo_Light.svg")} />
            <img className="reactLogo" alt="" src={require("../assets/react_logo.svg")} />
            <img className="githubPagesLogo" alt="" src={require("../assets/github_pages.png")} />
          </div>
        </main>
        <footer className="splashFooter">
          <ul>
            <li><a href="https://michaelcruz.io">michaelcruz.io</a></li>
            <li><a href="https://www.linkedin.com/in/michaelrcruz/">linkedin</a></li>
            <li><a href="https://www.instagram.com/mikeyscript/">instagram</a></li>
          </ul>
        </footer>
      </div>
    )
  };
};

export default Splash;
