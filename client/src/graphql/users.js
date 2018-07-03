import gql from 'graphql-tag'

export const GET_USERS_QUERY = gql`
  {
    getUsers {
      id
      firstName
      lastName
      email
      avatarUrl
    }
  }
`

export const SEND_INVITATION_MUTATION = gql`
  mutation sendInvitation($email: String!) {
    sendInvitation(email: $email) {
      success
      errors {
        path
        message
      }
    }
  }
`

export const GET_USER_QUERY = gql`
  query getUser($id: Int!) { 
    getUser(id: $id) {
      id
      firstName
      email
    }
  }
`