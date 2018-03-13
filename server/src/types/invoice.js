export default `
  scalar Date

  type Invoice {
    deadline: Date!
    paymentTerm: Int!
    interestInArrears:Int!
    status: String!
    referenceNumber: Int!
    description: String
    total: Int!
  }

`
