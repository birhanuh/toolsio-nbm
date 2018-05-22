export default `
  
  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    tax: Float!
    items: [Item!]
    customerId: Int!
    customer: Customer!
    user: User!
    total: Float!
  }

  type GetSalesResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    customer: Customer!
    user: User!
  }

  type GetSalesWithoutInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    customer: Customer!
    total: Float
  }

  type GetSalesWithInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    customer: Customer!
    total: Float
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
    
    getSales(offset: Int!, limit: Int!, order: String!): [GetSalesResponse!]!

    getSalesWithoutInvoice: [GetSalesWithoutInvoiceResponse!]!

    getSalesWithInvoice: [GetSalesWithoutInvoiceResponse!]!
  }

  type Mutation {
    createSale(name: String!, deadline: Date!, status: String!, description: String,
      customerId: Int!): CreateUpdateSaleResponse!
    
    updateSale(id: Int!, name: String, deadline: Date, status: String, description: String, 
      ,customerId: Int): CreateUpdateSaleResponse!

    deleteSale(id: Int!): DeleteSaleResponse!
  }

`
