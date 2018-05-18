import gql from 'graphql-tag'

export const GET_USERS_WITH_UNREAD_MESSAGES_COUNT_QUERY = gql`
  {
    getDirectMessageUsersWithUnreadMessagesCount {
      success
      usersUnreadDirectMessagesCount {
        sender_id
        count
        user {
          id
          firstName
          email
        }
      }
      errors {
        path
        message
      }
    }
  }
`

export const GET_UNREAD_DIRECT_MESSAGES_COUNT_QUERY = gql`
  {
    getUnreadDirectMessagesCount {
      count
    }
  }
`

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
