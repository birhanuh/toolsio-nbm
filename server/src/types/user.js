export default `

  type User {
    id: Int!
    firstName: String
    lastName: String 
    email: String!
    password: String! 
    avatarUrl: String
    isConfirmed: Boolean!
    isAdmin: Boolean!
  }

  type Query {
    getUser(id: Int!): User!
    getAllUsers: [User!]!
  }

  type Mutation {
    createUser(firstName: String, lastName: String, email: String!, password: String!, avatarUrl: String): User!
  }

`
