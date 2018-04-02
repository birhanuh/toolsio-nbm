export default `

  type DirectMessage {
    id: Int!
    message: String!
    isRead: Boolean!
    senderId: Int!
    createdAt: Date!
    sender: User!
  }

  type CreateDirectMessageResponse {
    success: Boolean!
    message: DirectMessage 
    errors: [Error!]
  }

  type Query {
    getDirectMessage(id: Int!): DirectMessage
    getDirectMessages(receiverId: Int!): [DirectMessage!]!
  }

  type Mutation {
    createDirectMessage(message: String!, receiverId: Int! ): CreateDirectMessageResponse!
  }

  type Subscription {
    getNewDirectMessage(receiverId: Int!): DirectMessage!
  }
`
