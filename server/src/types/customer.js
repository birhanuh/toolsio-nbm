export default `

  type Customer {
    id: Int!
    name: String!
    vatNumber: Int! 
    email: String
    phoneNumber: String 
    isContactIncludedInInvoice: Boolean!
    street: String
    postalCode: String
    region: String 
    country:String
    projects: [Project!]
    sales: [Sale!]
    invoices: [Invoice!]
    user: User!
  }

  type GetCustomersResponse {
    id: Int!
    name: String!
    vatNumber: String!
    email: String
    phoneNumber: String
  }

  type CreateUpdateCustomerResponse {
    success: Boolean!
    customer: Customer!
    errors: [Error!]
  }

  type DeleteCustomerResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getCustomer(id: Int!): Customer
    
    getCustomers: [GetCustomersResponse!]!
  }

  type Mutation {
    createCustomer(name: String!, vatNumber: Int!, email: String, phoneNumber: String, isContactIncludedInInvoice: Boolean, 
      street: String, postalCode: String, region: String, country: String): CreateUpdateCustomerResponse!
    
    updateCustomer(id: Int!, name: String, vatNumber: Int, email: String, phoneNumber: String, isContactIncludedInInvoice: Boolean, 
      street: String, postalCode: String, region: String, country: String): CreateUpdateCustomerResponse! 

    deleteCustomer(id: Int!): DeleteCustomerResponse!   
  }

`
