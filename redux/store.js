"use client"
// store.js
import { createStore, applyMiddleware } from 'redux';
import apiReducer from './reducers/apiReducer';

const store = createStore(apiReducer);

export default store;
