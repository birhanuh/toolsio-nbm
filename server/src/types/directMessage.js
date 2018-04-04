export default `

  type DirectMessage {
    id: Int!
    message: String!
    isRead: Boolean!
    senderId: Int!
    receiverId: Int!
    createdAt: Date!
    user: User!
  }

  type CreateDirectMessageResponse {
    success: Boolean!
    message: DirectMessage 
    errors: [Error!]
  }

  type DirectMessageUsers {
    user: User!
  }

  type Query {
    getDirectMessage(id: Int!): DirectMessage
    getDirectMessages(receiverId: Int!): [DirectMessage!]!
    getDirectMessageUsers(receiverId: Int!): [DirectMessageUsers!]!
  }

  type Mutation {
    createDirectMessage(message: String!, receiverId: Int! ): CreateDirectMessageResponse!
  }

  type Subscription {
    getNewDirectMessage(receiverId: Int!): DirectMessage!
  }
`
