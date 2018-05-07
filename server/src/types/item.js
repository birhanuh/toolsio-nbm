export default `

  type Item {
    id: Int!
    name: String!
    unit: String!
    quantity: Int!
    price: Float!
    vat: Int
    saleId: Int!
  }

  type CreateUpdateItemResponse {
    success: Boolean!
    item: Item 
    errors: [Error!]
  }

  type DeleteItemResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getItem(id: Int!): Item!
    
    getItems: [Item!]!
  }

  type Mutation {
    createItem(name: String!, unit: String!, quantity: Int!, price: Float!, vat: Int, 
      saleId: Int!): CreateUpdateItemResponse!

    updateItem(id: Int!, name: String!, unit: String!, quantity: Int!, price: Float!, vat: Int, 
      saleId: Int!): CreateUpdateItemResponse!

    deleteItem(id: Int!): DeleteItemResponse!
  }

`
