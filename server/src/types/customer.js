export default `

  type Customer {
    id: Int!
    name: String!
    vatNumber: String! 
    email: String
    phoneNumber: String 
    isContactIncludedInInvoice: Boolean!
    street: String
    postalCode: String! 
    region: String 
    country:String!
    projects: [Project!]
    sales: [Sale!]
    invoices: [Invoice!]
  }

  type GetCustomersResponse {
    id: Int!
    name: String!
    vatNumber: String!
    email: String
    phoneNumber: String
  }

  type CreateCustomerResponse {
    success: Boolean!
    customer: Customer
    errors: [Error!]
  }

  type Query {
    getCustomer(id: Int!): Customer!
    getCustomers: [GetCustomersResponse!]!
  }

  type Mutation {
    createCustomer(name: String!, vatNumber: String!, email: String, phoneNumber: String, isContactIncludedInInvoice: Boolean, 
      street: String, postalCode: String, region: String, country: String): CreateCustomerResponse!
  }

`
