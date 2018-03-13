export default `

  type Message {
    id: Int!
    title: String!
    body: String!
    isRead: Boolean!
    isDrafted: Boolean!
    author: [User!]!
  }

`
