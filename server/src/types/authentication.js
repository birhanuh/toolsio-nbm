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

  type IsSubdomainExistResponse {
    success: Boolean!
    subdomain: String
    errors: [Error!]
  }

  type ForgotPasswordResetRequestPasswordResetResponseVerifyUserEmail {
    success: Boolean!
    errors: [Error!]
  }

  type Mutation {
    registerUser(firstName: String, lastName: String, email: String!, password: String!,
      subdomain: String!, industry: String!): RegisterResponse!

    loginUser(email: String!, password: String!): LoginResponse!

    isSubdomainExist(subdomain: String!): IsSubdomainExistResponse!

    forgotPasswordResetRequest(email: String!): ForgotPasswordResetRequestPasswordResetResponseVerifyUserEmail!

    passwordReset(password: String! token: String!): ForgotPasswordResetRequestPasswordResetResponseVerifyUserEmail!
    
    registerInvitedUser(firstName: String, lastName: String, email: String!, password: String!, token: String!): RegisterResponse!

    confirmUserEmail(token: String!): ForgotPasswordResetRequestPasswordResetResponseVerifyUserEmail!
  }

`