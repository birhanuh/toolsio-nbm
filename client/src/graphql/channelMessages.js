import gql from 'graphql-tag'

export const GET_CHANNEL_QUERY = gql`
  query getChannel($id: Int!) {
    getChannel(id: $id) {
      id
      name
      users {
        id
        email
      }
    }
  }
`

export const GET_CHANNEL_MESSAGE_QUERY = gql`
  query getChannelMessages($cursor: String, $channelId: Int!) {
    getChannelMessages(cursor: $cursor, channelId: $channelId) {
      id
      body
      uploadPath
      mimetype
      userId
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