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
    member: User 
    errors: [Error!]
  }

  type Query {
    getChannel(id: Int!): Channel!
    getChannels: [GetChannelAndUsersCountResponse!]!
  }

  type Mutation {
    createChannel(name: String): CreateChannelResponse!
    addMember(userId: Int!, channelId: Int!): AddMemberResponse!
  }

`
