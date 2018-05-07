import gql from 'graphql-tag'

export const ADD_MEMBER_MUTATION = gql`
  mutation addMember($members: [Int!], $channelId: Int!) {
    addMember(members: $members, channelId: $channelId ) {
      success
      member {
        id
        firstName
        email
      } 
      errors {
        path
        message
      }
    }
  }
`

export const GET_CHANNEL_USERS_QUERY = gql`
  query getChannel($id: Int!) {
    getChannel(id: $id) {
      id
      name
      users {
        id
        email
      }
    }
    getUsers {
      id
      firstName
      lastName
      email
    }
  }
`

export const CREATE_CHANNEL_MUTATION = gql`
  mutation createChannel($name: String!) {
    createChannel(name: $name) {
      success
      channel {
        id 
        name
      }
      errors {
        path
        message
      }
    }
  }
`

export const GET_CHANNELS_QUERY = gql`
  {
    getChannels {
      id
      name
      getUsersCount 
    }
  }
`

export const CREATE_MESSAGE_MUTATION = gql`
  mutation ($body: String, $file: Upload, $channelId: Int!) {
    createMessage(body: $body, file: $file, channelId: $channelId)  {
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