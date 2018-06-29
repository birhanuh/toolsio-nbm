export default `

  type RegisterResponse {
    success: Boolean!
    account: Account
    errors: [Error!]
  }

  type LoginResponse {
    success: Boolean!
    authToken: String
    refreshAuthToken: String
    errors: [Error!]
  }

  type Mutation {
    registerUser(firstName: String, lastName: String, email: String!, password: String!,
      subdomain: String!, industry: String!): RegisterResponse!

    loginUser(email: String!, password: String!): LoginResponse!

    registerInvitedUser(firstName: String, lastName: String, email: String!, password: String!, token: String!): RegisterResponse!
  }

`