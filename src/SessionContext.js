import React from 'react'

export const SessionContext = React.createContext({
  session: {},
  updateSession: () => {}
});

export default SessionContext;
