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
    account: Account
    errors: [Error!]
  }

  type LoginResponse {
    success: Boolean!
    authToken: String
    refreshAuthToken: String
    errors: [Error!]
  }

  type SendInvitationResponse {
    success: Boolean!
    account: Account!
    errors: [Error!]
  }

  type S3SignAvatarResponse {
    signedRequest: String!
    url: String!
    errors: [Error!]
  }

  type Query {
    getUser(email: String!): User!
    getUsers: [GetUsersResponse!]!
  }

  type Mutation {
    registerUser(firstName: String, lastName: String, email: String!, password: String!, 
      subdomain: String!, industry: String!): RegisterResponse!

    loginUser(email: String!, password: String!): LoginResponse!

    sendInvitation(email: String!): SendInvitationResponse!

    registerInvitedUser(firstName: String, lastName: String, email: String!, password: String!, token: String!): RegisterResponse!

    s3SignAvatar(fileName: String!, fileType: String!): S3SignAvatarResponse!
  }

`
