import gql from 'graphql-tag'

export const GET_DIRECT_MESSAGE_USERS_QUERY = gql`
  {
    getDirectMessageUsers {
      id
      first_name
      email
    }
  }
`

export const CREATE_DIRECT_MESSAGE_MUTATION = gql`
  mutation ($body: String, $file: Upload, $receiverId: Int!) {
    createDirectMessage(body: $body, file: $file, receiverId: $receiverId) {
      success
      message {
        id
      } 
      errors {
        path
        message
      }
    }
  }
`
