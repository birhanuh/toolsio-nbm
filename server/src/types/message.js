export default `

  type Message {
    id: Int!
    title: String!
    body: String!
    isRead: Boolean!
    isArchived: Boolean!
    author: Int!
    createdAt: Date!
  }

  type GetReadAndArchivedCountsMessageResponse {
    success: Boolean!
    unreadCount: Int!
    archivedCount: Int 
    errors: [Error!]
  }

  type CreateMessageResponse {
    success: Boolean!
    message: Message 
    errors: [Error!]
  }

  type Query {
    getMessage(id: Int!): Message
    getInboxMessages: [Message!]!
    getSentMessages: [Message!]!
    getArchiveMessages: [Message!]!
    getReadAndArchivedCounts: GetReadAndArchivedCountsMessageResponse!
  }

  type Mutation {
    createMessage(title: String!, body: String!, recipientId: Int!): CreateMessageResponse!
  }

`
