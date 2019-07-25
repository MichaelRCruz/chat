// import React from 'react';
// import SessionContext from '../SessionContext.js';
// import defaultUserImage from './../assets/images/peaceful_potato.png';
// import './Users.css';
//
// const Traffic = props => {
//
//   // static contextType = SessionContext;
//
//   const { traffic } = props;
//   const _traffic = traffic ? traffic : [];
//   const actions = _traffic.map((user, i) => {
//     const { photoURL, displayName, action, key } = user;
//     return (
//       <li className="onlineUser" key={i}>
//         <div className={"userContainer"}>
//           <img
//             className="userMenuImage"
//             alt="user"
//             src={ photoURL || defaultUserImage}
//            />
//           <div className="menuDisplayName">{displayName}</div>
//         </div>
//         <p>{action}</p>
//       </li>
//     );
//   });
//   return (
//     <ul>{actions}</ul>
//   );
// }
//
// export default Traffic;




import React from 'react';
import * as firebase from 'firebase';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import {throttling} from '../utils.js';
import SessionContext from '../SessionContext.js';

class Traffic extends React.Component {

  state = {
    traffic: []
  }

  static contextType = SessionContext;

  componentDidMount() {
    let traffic = [];

    const userThrottler = throttling(async () => {
      const target = this.state.traffic[0];
      const timeStamp = target ? target.unixStamp : null;
      traffic = traffic.filter(user => {
        const isStamp = user.unixStamp === timeStamp;
        return !isStamp;
      });
      this.setState({ traffic });
    }, 100);

    const trafficRef = firebase.database().ref(`/TRAFFIC`);

    trafficRef
      .limitToLast(5)
      .on('child_added', snap => {
        const user = snap.val();
        traffic.push(user);
        userThrottler();
      });

    trafficRef
      .limitToLast(1)
      .on('child_removed', snap => {
        const user = snap.val();
        traffic.push(user);
        userThrottler();
      });
  }

  render() {
    const { traffic } = this.state;
    const _traffic = traffic ? traffic : [];
    const actions = _traffic.map((user, i) => {
      const { photoURL, displayName, action, key } = user;
      return (
        <li className="onlineUser" key={i}>
          <div className={"userContainer"}>
            <img
              className="userMenuImage"
              alt="user"
              src={ photoURL || defaultUserImage}
             />
            <div className="menuDisplayName">{displayName}</div>
          </div>
          <p>{action}</p>
        </li>
      );
    });
    return (
      <ul>{actions}</ul>
    );
  }

}

export default Traffic;
