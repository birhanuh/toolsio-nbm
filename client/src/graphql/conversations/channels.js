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
  mutation createChannel($name: String!, $isPublic: Boolean) {
    createChannel(name: $name, isPublic: $isPublic) {
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

export const GET_CHANNELS_USERS_COUNT_QUERY = gql`
  {
    getChannelsUsersCount {
      id
      name
      usersCount 
    }
  }
`
