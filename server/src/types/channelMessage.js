export default `
  
  scalar Upload

  type Message {
    id: Int!
    body: String
    isRead: Boolean!
    channelId: Int!
    userId: Int!
    createdAt: Date!
    user: User!
    uploadPath: String
    mimetype: String
  }

  type CreateMessageResponse {
    success: Boolean!
    message: Message! 
    errors: [Error!]
  }

  type Query {
    getMessage(id: Int!): Message

    getChannelMessages(cursor: String, channelId: Int!): [Message!]!
  }

  type Mutation {
    createMessage(body: String, file: Upload, channelId: Int! ): CreateMessageResponse!
  }

  type Subscription {
    getNewChannelMessage(channelId: Int!): Message!
  }
`
