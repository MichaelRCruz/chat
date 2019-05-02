import * as actions from '../actions';

const initialState = {
  user: {}
};

export const chatReducer = (state = initialState, action) => {
  if (action.type === actions.SET_USER) {
    return Object.assign({}, state, {
      user: action.user
    });
  }
  return state;
};
