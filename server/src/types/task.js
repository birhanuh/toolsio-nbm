export default `

  type Task {
    id: Int!
    name: String!
    hours: String!
    paymentType: String!
    price: Float!
    total: Int!
    project: Project!
  }

  type Query {
    getTask(id: Int!): Task!
    getAllTasks: [Task!]!
  }

  type Mutation {
    createTask(name: String!, hours: String!, paymentType: String!, price: Float!, vat: Int!, projectId: Int!): Task!
  }

`
