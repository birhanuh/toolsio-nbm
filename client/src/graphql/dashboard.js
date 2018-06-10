import gql from "graphql-tag"

export const GET_TOTAL_INCOME_DATA = gql`
  {
    getTotalIncomeData {
      tasksTotalSum
      itemsTotalSum
    }
  }
`

export const GET_INCOMES_DATA = gql`
  {
    getIncomesData {
      daySum {
        day
        sum
      }
      monthSum {
        month
        sum
      }
    }
  }
`

export const GET_CUSTOMERS_DATA = gql`
  {
    getCustomersData {
      nameCountProjectsSales {
        name
        projectsSalesCount
      }
    }
  }
`

export const GET_PROJECTS_DATA = gql`
  {
    getProjectsData {
      countStatus {
        status
        count
      }
      countMonth {
        month
        count
      }
    }
  }
`


export const GET_SALES_DATA = gql`
  {
    getSalesData {
      countStatus {
        status
        count
      }
      countMonth {
        month
        count
      }
    }
  }
`

export const GET_INVOICES_DATA = gql`
  {
    getInvoicesData {
      countStatusMonth {
        status
        count
        month
      }
      countMonth {
        month
        count
      }
  }
}
`

export const GET_PROJECT_TASKS_DATA = gql`
  {
    getProjectTasksData {
      countStatus {
        status
        count
      }
      idNameStatus {
        id
        name 
        status
      }
    }
  }
`

export const GET_SALE_TASKS_DATA = gql`
  {
    getSaleTasksData {
      countStatus {
        status
        count
      }
      idNameStatus {
        id
        name 
        status
      }
    }
  }
`

export const GET_INVOICE_TASKS_DATA = gql`
  {
    getInvoiceTasksData {
      countStatus {
        count
        status
      }
      idProjectStatus {
        id
        status
        name
      }
      idSaleStatus {
        id
        status
        name
      }
    }
  }
`