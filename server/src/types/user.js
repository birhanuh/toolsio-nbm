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

  type GetUsersResponse {
    id: Int!
    firstName: String
    lastName: String
    email: String!
    isConfirmed: Boolean!
  }

  type RegisterResponse {
    success: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    success: Boolean!
    token: String
    refreshToken: String
    errors: [Error!]
  }

  type Query {
    getUser(id: Int!): User!
    getUsers: [GetUsersResponse!]!
  }

  type Mutation {
    registerUser(firstName: String, lastName: String, email: String!, password: String!, avatarUrl: String, 
      subdomain: String!, industry: String!): RegisterResponse!
    loginUser(email: String!, password: String!): LoginResponse!

  }

`
