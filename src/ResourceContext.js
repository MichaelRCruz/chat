import React from 'react'

export const ResourceContext = React.createContext({
  messages: {},
  rooms: [],
  users: [],
  createMessage: () => {},
  updateMessage: () => {},
  destroyMessage: () => {},
  createRoom: () => {},
  updateRoom: () => {},
  destroyRoom: () => {},
  updateUser: () => {},
  destrotyUser: () => {}
});

export default ResourceContext;
