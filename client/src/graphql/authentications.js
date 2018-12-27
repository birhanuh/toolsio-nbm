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
      sessionID
      user {
        id 
        firstName
        lastName
        email
        isAdmin
      }
      subdomain
      errors {
        path
        message
      }
    }
  }
`

export const GET_CURRENT_ACCOUNT_QUERY = gql`
  { 
    getCurrentAccount {
      user {
        id
        firstName
        lastName
        email
        isAdmin
      }
      subdomain
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

export const FORGOT_PASSWORD_REQUEST_MUTATION = gql`
  mutation($email: String!) {
    forgotPasswordResetRequest(email: $email) {
      success
      errors {
        path
        message
      }
    }
  }
`

export const PASSWORD_RESET_MUTATION = gql`
  mutation($password: String!, $token: String!) {
    passwordReset(password: $password, token: $token) {
      success
      errors {
        path
        message
      }
    }
  }
`

export const VERIFY_USER_EMIAIL_MUTATION = gql`
  mutation($token: String!) {
    confirmUserEmail(token: $token) {
      success
      errors {
        path
        message
      }
    }
  }
`
