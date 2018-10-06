import gql from 'graphql-tag'

export const CREATE_TASK_MUTATION = gql`
  mutation createTask($name: String!, $hours: String!, $paymentType: String!, $unitPrice: Float!, $total: Float!, $projectId: Int!) {
    createTask(name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
      success
      task {
        id
        name
        hours
        paymentType
        unitPrice
        total
        projectId
      }
      errors {
        path
        message
      }
    }
  }
`

export const UPDATE_TASK_MUTATION = gql`
  mutation updateTask($id: Int!, $name: String, $hours: String, $paymentType: String, $unitPrice: Float, $total: Float, $projectId: Int) {
    updateTask(id: $id, name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
      success
      task {
        id
        name
        hours
        paymentType
        unitPrice
        total
        projectId
      }
      errors {
        path
        message
      }
    }
  }
`

export const DELETE_TASK_MUTATION = gql`
  mutation deleteTask($id: Int!) {
    deleteTask(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`
