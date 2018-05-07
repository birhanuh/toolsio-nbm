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
    channel: Channel!
    errors: [Error!]
  }

  type AddMemberResponse {
    success: Boolean!
    members: [Int!] 
    errors: [Error!]
  }

  type Query {
    getChannel(id: Int!): Channel!
    
    getChannels: [GetChannelAndUsersCountResponse!]!
  }

  type Mutation {
    createChannel(name: String): CreateChannelResponse!
    
    addMember(members: [Int!], channelId: Int!): AddMemberResponse!
  }

`
