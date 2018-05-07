import gql from 'graphql-tag'

export const REGISTER_USER_MUTATION = gql`
  mutation registerUser($firstName: String, $lastName: String, $email: String!, $password: String!, $subdomain: String!, $industry: String!) {
    registerUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, subdomain: $subdomain, industry: $industry) {
      success
      account {
        subdomain
      }
      errors {
        path
        message
      }
    }
  }
`

export const REGISTER_INVITED_USER_MUTATION = gql`
  mutation($firstName: String, $lastName: String, $email: String!, $password: String!, $token: String!) {
    registerInvitedUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, token: $token) {
      success
      account {
        subdomain
      }
      errors {
        path
        message
      }
    }
  }
`

export const LOGIN_USER_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      authToken 
      refreshAuthToken
      errors {
        path
        message
      }
    }
  }
`

export const IS_SUBDOMAIN_EXIST_MUTATION = gql`
  mutation($subdomain: String!) {
    isSubdomainExist(subdomain: $subdomain) {
      success
      subdomain
      errors {
        path
        message
      }
    }
  }
`
