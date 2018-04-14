export default `
  
  scalar Upload

  type Message {
    id: Int!
    message: String
    isRead: Boolean!
    channelId: Int!
    userId: Int!
    createdAt: Date!
    user: User!
    uploadPath: String!
    mimetype: String!
  }

  type GetUnreadCountsMessageResponse {
    success: Boolean!
    unreadCount: Int!
    errors: [Error!]
  }

  type CreateMessageResponse {
    success: Boolean!
    message: Message 
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
    createMessage(message: String, file: Upload, channelId: Int! ): CreateMessageResponse!
  }

  type Subscription {
    getNewChannelMessage(channelId: Int!): Message!
  }
`
