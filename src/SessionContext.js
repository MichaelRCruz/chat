import React from 'react'

export const SessionContext = React.createContext({
  activeRoom: {},
  requestNotifPermission: () => {},
  user: {},
  userConfig: {},
  fcmToken: '',
  updateSession: () => {}
});

export default SessionContext;
