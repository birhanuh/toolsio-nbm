export default `

  type Item {
    id: Int!
    name: String!
    unit: String!
    quantity: Int!
    price: Float!
    vat: Int!
    sale: Sale!
  }

  type Query {
    getItem(id: Int!): Item!
    getAllItems: [Item!]!
  }

  type Mutation {
    createItem(name: String!, unit: String!, quantity: Int!, price: Float!, vat: Int!, saleId: Int!): Item!
  }

`
