//var React = require('react') // ES5 version
import React, { Component } from 'react' // ES6 version
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import routes from './routes'

const store = createStore(
  (state = {}) => state,
  applyMiddleware(thunk)
)

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>, document.getElementById('app'))