export default `

  type Message {
    id: Int!
    message: String!
    isRead: Boolean!
    channelId: Int!
    userId: Int!
    createdAt: Date!
    user: User!
  }

  type GetUnreadCountsMessageResponse {
    success: Boolean!
    unreadCount: Int!
    errors: [Error!]
  }

  type CreateMessageResponse {
    success: Boolean!
    message: Message 
    channel: Channel
    errors: [Error!]
  }

  type Query {
    getMessage(id: Int!): Message
    getChannelMessages(channelId: Int!): [Message!]!
    getInboxMessages: [Message!]!
    getSentMessages: [Message!]!
    getUnreadCounts: GetUnreadCountsMessageResponse!
  }

  type Mutation {
    createMessage(message: String!, channelId: Int!, userId: Int! ): CreateMessageResponse!
  }

`
