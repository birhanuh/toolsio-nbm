export default `
  
  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    items: [Item!]
    customer: Customer!
  }

  type GetSalesResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    total: Int
    customer: Customer!
  }

  type CreateUpdateSaleResponse {
    success: Boolean!
    sale: Sale!
    errors: [Error!]
  }

  type DeleteSaleResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getSale(id: Int!): Sale
    getSales: [GetSalesResponse!]!
  }

  type Mutation {
    createSale(name: String!, deadline: Date!, status: String!, description: String, total: Int, customerId: Int!): CreateUpdateSaleResponse!
    
    updateSale(id: Int!, name: String!, deadline: Date!, status: String!, description: String, 
      total: Int, customerId: Int!): CreateUpdateSaleResponse!

    deleteSale(id: Int!): DeleteSaleResponse!
  }

`
