export default `

  type Invoice {
    id: Int!
    deadline: Date
    paymentTerm: Int
    interestInArrears: Int!
    status: String!
    description: String
    total: Int!
    project: Project
    sale: Sale
  }

  type GetInvoicesResponse {
    id: Int!
    deadline: Date!
    referenceNumber: String!
    status: String!
    total: Int!
    project: Project
    sale: Sale
    customer: Customer! 
  }

  type CreateUpdateInvoiceResponse {
    success: Boolean!
    invoice: Invoice 
    errors: [Error!]
  }

  type Query {
    getInvoice(id: Int!): Invoice!
    getInvoices: [GetInvoicesResponse!]!
  }

  type Mutation {
    createInvoice(deadline: Date, paymentTerm: Int, interestInArrears: Int!, status: String!, 
      , description: String, total: Int!, projectId: Int, saleId: Int, 
      customerId: Int!): CreateUpdateInvoiceResponse!
    updateInvoice(id: Int!, deadline: Date, paymentTerm: Int, interestInArrears: Int!, status: String!, 
      , description: String, total: Int!, projectId: Int, saleId: Int, 
      customerId: Int!): CreateUpdateInvoiceResponse!  
  }
`
