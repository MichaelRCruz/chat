import React from 'react'

export const ResourceContext = React.createContext({
  messages: {},
  users: [],
  subscribedRooms: [],
  activeRoom: {},
  updateActiuveRoom: () => {}
});

export default ResourceContext;
