export default `

  type Channel {
    id: Int!
    name: String!
    users: [User!]!
  }

  type GetChannelAndUsersCountResponse {
    id: Int!
    name: String!
    getUsersCount: Int!
  }

  type CreateChannelResponse {
    success: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type AddMemberResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getChannel(id: Int!): Channel!
    getChannels: [GetChannelAndUsersCountResponse!]!
  }

  type Mutation {
    createChannel(name: String): CreateChannelResponse!
    addMemeber(userId: Int!, channelId: Int!): AddMemberResponse!
  }

`
