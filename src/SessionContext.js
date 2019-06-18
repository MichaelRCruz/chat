import React from 'react';

const SessionContext = React.createContext({
  activeRoom: {},
  fcmToken: '',
  user: {},
  userConfig: {}
});

export default SessionContext;
