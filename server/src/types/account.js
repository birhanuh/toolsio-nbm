export default `

  type Account {
    id: Int!
    owner: User!
    subdomain: String!
    industry: String!
    phoneNumber: String
    email: String
    street: String
    postalCode: Int
    region: String
    country: String
    logoUrl: String
  }

  type Query {
    getAccount(id: Int!): Account!
    getAllAccounts: [Account!]!
  }

  type Mutation {
    createAccount(owner: Int!, subdomain: String!, industry: String!, phoneNumber: String, email: String, street: String, postalCode: Int, region: String, country: String, logoUrl: String): Account!
  }

`