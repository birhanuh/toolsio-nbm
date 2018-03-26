export default `

  type Conversation {
    id: Int!
    user: User!
  }

  type Query {
    getConversation(id: Int!): Conversation!
    getConversations: [Conversation!]!
  }

  type Mutation {
    createConversation(userId: Int!): Conversation!
  }

`
