//var React = require('react') // ES5 version
import React from 'react' // ES6 version
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
//import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Authorization } from './utils'
import { setCurrentAccount } from './actions/authenticationActions'
// Apollo
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'

// Localization 
import T from 'i18n-react'

import App from './components/Layouts/App'
//import routes from './routes'

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql'
})

// middleWares and afterwares
const middlewareLink = setContext(() => {
  headers: {
    'subdomain':Authorization.getSubdomain(), // Parse subdomain 
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refresh-token')
  }
})

const afterwareLink = new ApolloLink((operation, forward) => forward(operation).map(response) => {
  const { headers } = operation.getContext()

  if (headers) {
    const token = headers.get('x-token')
    const refreshToken = headers.get('x-refresh-token')

    if (token) {
      localStorage.setItem('token', token)
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  return forward(operation)
})

// Use with apollo-client
const link = afterwareLink.concat(middlewareLink.concat(httpLink))

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

/*
// A state for the entire project created by Redux
const store = createStore(
  rootReducer,
  //(state = {}) => state, // Dummy Reducer
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)
*/

/*
// Parse subdomain 
let subdomain =  Authorization.getSubdomain()
subdomain && Authorization.setSubdomain(subdomain)

if (localStorage.currentAccount) {
  // Retrieve the object from storage
  var currentAccount = localStorage.getItem('currentAccount')
  //store.dispatch(setCurrentAccount(JSON.parse(currentAccount)))
}
*/

// Localization setup
let language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage

// language would be something like es-ES or es_ES. However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits
if (language.length > 2) {
  language = language.split("-")[0]
}    

T.setTexts(require("./locale/" +language+ ".json"))

render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>, document.getElementById('app'))

