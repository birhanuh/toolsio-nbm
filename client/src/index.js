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

// Localization 
import T from 'i18n-react'

// CSS
import './css/app.css'

import App from './components/Layouts/App'
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

// Localization setup
let language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage

// language would be something like es-ES or es_ES. However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits
if (language.length > 2) {
  language = language.split("-")[0]
  language = language.split("_")[0]
}    

T.setTexts(require("./locale/" +language+ ".json"))

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>, document.getElementById('app'))

