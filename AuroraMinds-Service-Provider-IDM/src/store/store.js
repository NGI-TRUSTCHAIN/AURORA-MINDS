import { createStore, applyMiddleware, compose } from "redux";
import { loadUser } from "redux-oidc";
import { routerMiddleware } from 'react-router-redux';
import reducer from '../reducer/index';
import { userManager, userManagerOlympus } from "../utils/userManager";
import { browserHistory } from 'react-router';

const loggerMiddleware = (store) => (next) => (action) => {
  console.log("Action type:", action.type);
  console.log("Action payload:", action.payload);
  console.log("State before:", store.getState());
  next(action);
  console.log("State after:", store.getState());
};
const initialState = {};

const createStoreWithMiddleware = compose(
  applyMiddleware(loggerMiddleware,
    routerMiddleware(browserHistory))
)(createStore);

const store = createStoreWithMiddleware(reducer, initialState);
loadUser(store, userManager);
loadUser(store, userManagerOlympus);

export default store;
