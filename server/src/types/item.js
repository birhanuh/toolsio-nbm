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

  type CreateItemResponse {
    success: Boolean!
    task: Task 
    errors: [Error!]
  }

  type Query {
    getItem(id: Int!): Item!
    getItems: [Item!]!
  }

  type Mutation {
    createItem(name: String!, unit: String!, quantity: Int!, price: Float!, vat: Int, 
      saleId: Int!): CreateItemResponse!
  }

`
