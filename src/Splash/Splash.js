import React from 'react';

import './Splash.css';

const Splash = ({toggleModal}) => {

  return (
    <div className="splashComponent">
      <header className="splashHeader">
        <div className="headerContentContainer">
          <div className="nameLogoContainer">
            <img className="splashLogo" src={require("../assets/images/potato2.svg")}
                 alt="potato logo"
                 onClick={toggleModal}
            />
            <p className="appName">Potato</p>
          </div>
          <i class="material-icons menuIcon">menu</i>
        </div>
      </header>
      <main className="splashMain">
        <div className="mainContentContainer">
          <h1 className="hero">
            Live chat with anyone, simplified.
          </h1>
          <p className="appDescription">
            Lorem ipsum dolor amet iPhone green juice squid, fam yr ennui bespoke banh mi cornhole. Health goth taxidermy.
          </p>
          <button className="getStartedButton">GET STARTED NOW</button>
          <img width="109" alt="" src="https://assets-global.website-files.com/5c991ff59b4c11294d51a8bd/5c991ff59b4c11602151a923_Google.svg" />
        </div>
      </main>
      <footer className="splashFooter">This is footer</footer>
    </div>
  );
};

export default Splash;
