export default `

  type Customer {
    id: Int!
    name: String!
    vatNumber: String! 
    email: String!
    phoneNumber: String! 
    isContactIncludedInInvoice: Boolean!
    street: String
    postalCode: String 
    region: String 
    country:String!
    projects: [Project!]
    sales: [Sale!]
    invoices: [Invoice!]
  }

  type Query {
    getCustomer(id: Int!): Customer!
    getAllCustomers: [Customer!]!
  }

  type Mutation {
    createCustomer(name: String!, vatNumber: Int!, email: String!, phoneNumber: String!, isContactIncludedInInvoice: Boolean, street: String, postalCode: String, region: String, country: String): Customer!
  }

`
