import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Authorization utils
import { getSubdomain } from './utils'

const httpLink = createUploadLink({
  uri: `${process.env.SERVER_HTTP_PROTOCOL}${process.env.SERVER_HOST}/graphql`
})

// middleWares and afterwares
const middlewareLink = setContext(() => ({
  headers: {
    'subdomain': getSubdomain(), // Parse subdomain 
    'x-auth-token': localStorage.getItem('authToken'),
    'x-refresh-auth-token': localStorage.getItem('refreshAuthToken')
  }
}))

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const { response: { headers } } = operation.getContext()

    if (headers) {
      const authToken = headers.get('x-auth-token')
      const refreshAuthToken = headers.get('x-refresh-auth-token')
   
      if (authToken) {
        localStorage.setItem('authToken', authToken)
      }

      if (refreshAuthToken) {
        localStorage.setItem('refreshAuthToken', refreshAuthToken)
      }
    }

    return response
  }))


// Use with apollo-client
const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink))

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
  uri: `${process.env.SERVER_WS_PROTOCOL}${process.env.SERVER_HOST}/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      authToken: console.log('Connection authToken', localStorage.getItem('authToken')) || localStorage.getItem('authToken'),
      refreshAuthToken: console.log('Connection refreshAuthToken', localStorage.getItem('refreshAuthToken')) || localStorage.getItem('refreshAuthToken')
    }
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
