export default `

  type DirectMessage {
    id: Int!
    body: String
    isRead: Boolean!
    senderId: Int!
    receiverId: Int!
    createdAt: Date!
    user: User!
    uploadPath: String
    mimetype: String
  }

  type CreateDirectMessageResponse {
    success: Boolean!
    message: DirectMessage 
    errors: [Error!]
  }

  type DirectMessageUsers {
    user: User!
  }

  type DirectMessageUser {
    id: Int!
    first_name: String
    email: String!
  }

  type UnreadDirectMessagesCount {
    count: Int!
  }

  type UsersUnreadDirectMessagesCount {
    count: Int!
    sender_id: Int!
    user: User!
  }

  type GetUnreadCountsMessageResponse {
    success: Boolean!
    usersUnreadDirectMessagesCount: [UsersUnreadDirectMessagesCount!]
    errors: [Error!]
  }

  type Query {
    getDirectMessage(id: Int!): DirectMessage
    
    getDirectMessages(receiverId: Int!): [DirectMessage!]!
    
    getDirectMessageUsers: [DirectMessageUser!]!

    getInboxDirectMessages: [DirectMessage!]!

    getSentDirectMessages: [DirectMessage!]!
    
    getUnreadDirectMessagesCount: UnreadDirectMessagesCount!

    getDirectMessageUsersWithUnreadMessagesCount: GetUnreadCountsMessageResponse!
  }

  type Mutation {
    createDirectMessage(body: String, file: Upload, receiverId: Int! ): CreateDirectMessageResponse!
  }

  type Subscription {
    getNewDirectMessage(receiverId: Int!): DirectMessage!
  }
`
