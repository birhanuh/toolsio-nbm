import gql from 'graphql-tag'

export const GET_UNREAD_DIRECT_MESSAGES_COUNT_QUERY = gql`
  {
    getUnreadDirectMessagesCount {
      count
    }
  }
`

export const GET_PROJECT_TASKS_DATA_QUERY = gql`
  {
    getProjectTasksData {
      countStatus {
        status
        count
      }
    }
  }
`

export const GET_SALE_TASKS_DATA_QUERY = gql`
  {
    getSaleTasksData {
      countStatus {
        status
        count
      }
    }
  }
`

export const GET_INVOICE_TASKS_DATA_QUERY = gql`
  {
    getInvoiceTasksData {
      countStatus {
        count
        status
      }
    }
  }
`