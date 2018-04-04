import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Authorization utils
import { Authorization } from './utils'

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql'
})

// middleWares and afterwares
const middlewareLink = setContext(() => ({
  headers: {
    'subdomain': Authorization.getSubdomain(), // Parse subdomain 
    'x-auth-token': localStorage.getItem('authToken'),
    'x-refresh-auth-token': localStorage.getItem('refreshAuthToken')
  }
}))

const afterwareLink = new ApolloLink((operation, forward) => {

  return forward(operation).map(response => {
    const { response: { headers } } = operation.getContext()
    
    if (headers) {
      const authToken = headers.get('x-auth-token')
      const refreshAuthToken = headers.get('x-refresh-auth-token')
      console.log('authToken', authToken)
      console.log('refreshAuthToken', refreshAuthToken)
      if (authToken) {
        localStorage.setItem('authToken', authToken)
      }

      if (refreshAuthToken) {
        localStorage.setItem('refreshAuthToken', refreshAuthToken)
      }
    }

    return response
  })
})

// Use with apollo-client
const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink))

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/subscriptions',
  options: {
    reconnect: true
  },
  connectionParams: {
    authToken: localStorage.getItem('authToken'),
    refreshAuthToken: localStorage.getItem('refreshAuthToken')
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkWithMiddleware,
)

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
})
