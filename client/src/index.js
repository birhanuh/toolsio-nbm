//var React = require('react') // ES5 version
import React from 'react' // ES6 version
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { setAuthorizationToken } from './utils'
import jwtDecode from 'jwt-decode'
import { setCurrentUser } from './actions/authentication'

// CSS
import './css/styles.css'

import App from './components/layout/App'
//import routes from './routes'

// A state for the entire project created by Redux
const store = createStore(
  rootReducer,
  //(state = {}) => state, // Dummy Reducer
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken)
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)))
}

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>, document.getElementById('app'))

