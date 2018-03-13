export default `

  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    items: [Item!]
    total: Int!
    invoice: Invoice!
  }

`
