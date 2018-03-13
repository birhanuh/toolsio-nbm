export default `

  type Account {
    id: Int!
    subdomain: String!
    industry: String!
    owner: User!
    phoneNumber: String
    email: String
    street: String
    postalCode: Int
    region: String
    country: String
    logoUrl: String
  }

`