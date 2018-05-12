import gql from 'graphql-tag'

export const GET_SALES_QUERY = gql`
  query getSales($offset: Int!, $limit: Int!, $order: String!) {
    getSales(offset: $offset, limit: $limit, order: $order) {
      id
      name 
      deadline
      status
      description
      customer {
        name
      }
      user {
        firstName
      }
    }
  }
`
export const GET_SALE_QUERY = gql`
  query getSale($id: Int!) {
    getSale(id: $id) {
      id
      name 
      deadline
      status
      description
      customerId
      customer {
        id
        name
      }
      items {
        id
        name
        unit
        quantity
        price
        vat
      }
    }
  }
`

export const CREATE_SALE_MUTATION = gql`
  mutation createSale($name: String!, $deadline: Date!, $status: String!, $description: String, $customerId: Int!) {
    createSale(name: $name, deadline: $deadline, status: $status, description: $description, customerId: $customerId) {
      success
      sale {
        id
        name 
        deadline
        status
        description
        customer {
          name
        }
      }
      errors {
        path
        message
      }
    }
  }
`

export const UPDATE_SALE_MUTATION = gql`
  mutation updateSale($id: Int!, $name: String, $deadline: Date, $status: String, $description: String, $customerId: Int) {
    updateSale(id: $id, name: $name, deadline: $deadline, status: $status, description: $description, customerId: $customerId) {
      success
      sale {
        id
        name
        deadline
        status
        description
        customer {
          id
          name
        }
      }
      errors {
        path
        message
      }
    }
  }
`

export const DELETE_SALE_MUTATION = gql`
  mutation deleteSale($id: Int!) {
    deleteSale(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`