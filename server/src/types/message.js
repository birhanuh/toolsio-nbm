export default `

  type Message {
    id: Int!
    title: String!
    body: String!
    isRead: Boolean!
    isDrafted: Boolean!
    author: User!
    conversationId: Conversation!
  }

  type Query {
    getMessage(id: Int!): Message!
    getAllMessages: [Message!]!
  }

  type Mutation {
    createMessage(author: Int!, title: String!, body: String!, conversationId: Int!): Message!
  }

`
