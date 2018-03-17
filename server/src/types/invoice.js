export default `

  type Invoice {
    deadline: Date!
    paymentTerm: Int
    interestInArrears:Int!
    status: String!
    referenceNumber: Int!
    description: String
    total: Int!
    customer: Customer!
    project: Project
    sale: Sale
  }

  type Query {
    getInvoice(id: Int!): Invoice!
    getAllInvoices: [Invoice!]!
  }

  type Mutation {
    createInvoice(deadline: Date!, paymentTerm: Int, interestInArrears: Int!, status: String!, referenceNumber: Int!, description: String, total: Int!, projectId: Int, saleId: Int): Invoice!
  }
`
