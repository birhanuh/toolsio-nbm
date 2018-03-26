export default `

  type Message {
    id: Int!
    title: String!
    body: String!
    isRead: Boolean!
    isDrafted: Boolean!
    author: Int!
    createdAt: Date!
  }

  type GetReadAndDraftedCountsMessageResponse {
    success: Boolean!
    unreadCount: Int!
    draftedCount: Int 
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
    getReadAndDraftedCounts: GetReadAndDraftedCountsMessageResponse!
  }

  type Mutation {
    createMessage(title: String!, body: String!, recipientId: Int!): CreateMessageResponse!
  }

`
