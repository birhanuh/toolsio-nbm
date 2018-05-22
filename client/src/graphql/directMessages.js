import gql from 'graphql-tag'

export const GET_UNREAD_DIRECT_MESSAGES_COUNT_SENDER_QUERY = gql`
  {
    getUnreadDirectMessagesCountSender {
      success
      unreadDirectMessagesCountSender {
        sender_id
        count
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

export const GET_USER_QUERY = gql`
  query getUser($id: Int!) {
    getUser(id: $id) {
      id
      firstName
      email
    }
  }
`

export const GET_DIRECT_MESSAGES_QUERY = gql`
  query getDirectMessages($receiverId: Int!) {
    getDirectMessages(receiverId: $receiverId) {
      id
      body
      uploadPath
      mimetype
      isRead
      createdAt
      user {
        id
        email
        avatarUrl
      }
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

export const MARK_DIRECT_MESSAGES_AS_READ_MUTATION = gql`
  mutation ($senderId: Int!) {
    markDirectMessagesAsRead(senderId: $senderId) {
      success 
      errors {
        path
        message
      }
    }
  }
`
