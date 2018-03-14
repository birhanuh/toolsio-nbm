export default `

  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    items: [Item!]
    total: Int!
    invoice: Invoice
  }

  type Query {
    getSale(id: Int!): Sale!
    getAllSales: [Sale!]!
  }

  type Mutation {
    createSale(name: String!, deadline: Date!, status: String!, description: String, total: Int): Sale!
  }

`
