export default `

  type Account {
    id: Int!
    owner: User!
    subdomain: String!
    industry: String!
    phoneNumber: String
    email: String
    street: String
    postalCode: String
    region: String
    country: String
    logoUrl: String
  }

  type Query {
    getAccount(subdomain: String!): Account
    getAccounts: [Account!]!
  }

  type Mutation {
    createAccount(owner: Int!, subdomain: String!, industry: String!): Account!
    updateAccount(industry: String!, phoneNumber: String, email: String, street: String, postalCode: String, region: String, country: String, logoUrl: String): Account!
  }

`