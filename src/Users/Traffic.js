import React, { useState, useContext, useEffect } from 'react';
import * as firebase from 'firebase';
import SessionContext from '../SessionContext.js';
import defaultUserImage from './../assets/images/peaceful_potato.png';
import { throttling } from '../utils.js';

const Traffic = props => {

  const { state } = useContext(SessionContext);
  const { activeRoom } = state;
  const [actions, setActions] = useState([]);

  useEffect(() => {
    let traffic = [];
    const trafficThrottler = throttling(async () => {
      // const target = actions[0];
      // const timeStamp = target ? target.lastChanged : null;
      // traffic = traffic.filter(user => {
      //   const isStamp = user.lastChanged === timeStamp;
      //   return !isStamp;
      // });
      // const userActions = [ ...actions, ...traffic ]
      const sortedActions = await traffic.sort((a, b) => {
        return b.lastChamged - a.lastChanged;
      });
      const slicedActions = await sortedActions.slice(Math.max(sortedActions.length - 5, 0))
      await setActions(slicedActions.reverse());
    }, 100);

    const addedRef = firebase.database().ref(`/TRAFFIC`);
    addedRef
      .on('child_added', snap => {
        const user = snap.val();
        traffic.push(user);
        // if (traffic.length > 5) traffic.shift();
        trafficThrottler();
      });

    // const removedRef = firebase.database().ref(`/USERS_ONLINE`);
    // removedRef
    //   .on('child_removed', snap => {
    //     const user = snap.val();
    //     traffic.push(user);
    //     trafficThrottler();
    //   });
      return () => {
        addedRef.off();
        // removedRef.off();
        setActions([]);
      }
  }, []);

  const actionsList = actions.map((user, i) => {
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
    <ul>{actionsList}</ul>
  );
}

export default Traffic;




// import React from 'react';
// import * as firebase from 'firebase';
// import defaultUserImage from './../assets/images/peaceful_potato.png';
// import {throttling} from '../utils.js';
// import SessionContext from '../SessionContext.js';
//
// class Traffic extends React.Component {
//
//   state = {
//     traffic: []
//   }
//
//   static contextType = SessionContext;
//
//   componentDidMount() {
//     let traffic = [];
//
//     const userThrottler = throttling(async () => {
//       const target = this.state.traffic[0];
//       const timeStamp = target ? target.unixStamp : null;
//       traffic = traffic.filter(user => {
//         const isStamp = user.unixStamp === timeStamp;
//         return !isStamp;
//       });
//       this.setState({ traffic });
//     }, 100);
//
//     const trafficRef = firebase.database().ref(`/TRAFFIC`);
//
//     trafficRef
//       .limitToLast(5)
//       .on('child_added', snap => {
//         const user = snap.val();
//         traffic.push(user);
//         userThrottler();
//       });
//
//     trafficRef
//       .limitToLast(1)
//       .on('child_removed', snap => {
//         const user = snap.val();
//         traffic.push(user);
//         userThrottler();
//       });
//   }
//
//   render() {
//     const { traffic } = this.state;
//     const _traffic = traffic ? traffic : [];
//     const actions = _traffic.map((user, i) => {
//       const { photoURL, displayName, action, key } = user;
//       return (
//         <li className="onlineUser" key={i}>
//           <div className={"userContainer"}>
//             <img
//               className="userMenuImage"
//               alt="user"
//               src={ photoURL || defaultUserImage}
//              />
//             <div className="menuDisplayName">{displayName}</div>
//           </div>
//           <p>{action}</p>
//         </li>
//       );
//     });
//     return (
//       <ul>{actions}</ul>
//     );
//   }
//
// }
//
// export default Traffic;
