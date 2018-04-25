export default `
  
  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    items: [Item!]
    total: Float
    customerId: Int!
    customer: Customer!
    user: User!
  }

  type GetSalesResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    total: Float!
    customer: Customer!
    user: User!
  }

  type GetSalesWithoutInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    total: Float
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

    getSalesWithoutInvoice: [GetSalesWithoutInvoiceResponse!]!
  }

  type Mutation {
    createSale(name: String!, deadline: Date!, status: String!, description: String,
      customerId: Int!): CreateUpdateSaleResponse!
    
    updateSale(id: Int!, name: String, deadline: Date, status: String, description: String, 
      total: Float, customerId: Int): CreateUpdateSaleResponse!

    deleteSale(id: Int!): DeleteSaleResponse!
  }

`
