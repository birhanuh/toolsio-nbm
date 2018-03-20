export default `
  
  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    items: [Item!]
    total: Int!
    customer: Customer!
  }

  type GetSalesResponse {
    name: String!
    deadline: Date!
    status: String!
    description: String
    customer: Customer!
  }

  type CreateSaleResponse {
    success: Boolean!
    sale: Sale 
    errors: [Error!]
  }

  type Query {
    getSale(id: Int!): Sale!
    getAllSales: [GetSalesResponse!]!
  }

  type Mutation {
    createSale(name: String!, deadline: Date!, status: String!, description: String, total: Int, customerId: Int!): CreateSaleResponse!
  }

`
