import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'

export default createStore(
    combineReducers({
        form: formReducer
    })
);

// import {createStore, combineReducers, applyMiddleware} from 'redux'
// import {reducer as formReducer} from 'redux-form'
// import thunk from 'redux-thunk';
//
// // export default createStore(
// //     combineReducers({
// //         form: formReducer
// //     })
// // );
//
// let createStoreWithMiddleware = applyMiddleware(thunk)( createStore );
// let store = createStoreWithMiddleware( formReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() );
//
// export default store;
