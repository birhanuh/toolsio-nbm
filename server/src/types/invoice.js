export default `

  type Invoice {
    id: Int!
    deadline: Date
    paymentTerm: Int
    interestInArrears: Int!
    status: String!
    referenceNumber: String!
    description: String
    createdAt: Date!
    tax: Float!
    customerId: Int!
    project: Project
    sale: Sale
    customer: Customer!
    user: User!
    total: Float!
  }

  type GetInvoicesResponseRows {
    id: Int!
    deadline: Date!
    referenceNumber: String!
    status: String!
    tax: Float!
    total: Float!
    projectId: Int
    saleId: Int
    project: Project
    sale: Sale
    customer: Customer! 
  }

  type GetInvoicesResponse {
    count: Int!
    invoices: [GetInvoicesResponseRows!]!
  }

  type CreateUpdateInvoiceResponse {
    success: Boolean!
    invoice: Invoice
    errors: [Error!]
  }

  type DeleteInvoiceResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getInvoice(id: Int!): Invoice
    
    getInvoices(offset: Int!, limit: Int!, order: String!): GetInvoicesResponse!
  }

  type Mutation {
    createInvoice(deadline: Date, paymentTerm: Int, interestInArrears: Int!, status: String!, 
      , description: String, tax: Float!, projectId: Int, saleId: Int, 
      customerId: Int!): CreateUpdateInvoiceResponse!
    
    updateInvoice(id: Int!, deadline: Date, paymentTerm: Int, interestInArrears: Int, status: String, 
      , description: String, tax: Float, projectId: Int, saleId: Int, 
      customerId: Int): CreateUpdateInvoiceResponse!  

    deleteInvoice(id: Int!): DeleteInvoiceResponse!
  }
`
