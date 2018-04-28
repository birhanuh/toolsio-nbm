export default `
  
  type DaySum {
    sum: Float!
    day: String!
  }

  type MonthSum {
    sum: Float!
    month: String!
  }

  type CountStatus {
    count: Int!
    status: String!
  }

  type IdStatus {
    id: Int!
    status: String!
  }

  type CountMonth {
    mon: String!
    yyyy: String!
    count: Int!
  }

  type CountStatusMonth {
    mon: String!
    yyyy: String!
    count: Int!
    status: String!
  }

  type TotalIncomeData {
    tasksTotalSum: Float!
    itemsTotalSum: Float!
  }

  type IncomesData {
    daySum: [DaySum!]!
    monthSum: [MonthSum!]!
  }

  type ProjectsSalesData {
    countStatus: [CountStatus!]!
    countMonth: [CountMonth]! 
  }

  type CustomersData {
    data: Float!
  }

  type InvoicesData {
    countMonth: [CountMonth]!
    countStatusMonth: [CountStatusMonth]! 
  }

  type ProjectTasksData {
    countStatus: [CountStatus!]!
    idStatus: [IdStatus!]!
  }

  type SaleTasksData {
    countStatus: [CountStatus!]!
    idStatus: [IdStatus!]!
  }

  type InvoiceTasksData {
    countStatus: [CountStatus!]!
    idStatus: [IdStatus!]!
  }

  type Query {
    getTotalIncomeData: TotalIncomeData!
    
    getIncomesData: IncomesData!
    
    getCustomersData: CustomersData!
    
    getProjectsData: ProjectsSalesData!
    
    getSalesData: ProjectsSalesData!
    
    getInvoicesData: InvoicesData!
    
    getProjectTasksData: ProjectTasksData!
    
    getSaleTasksData: SaleTasksData!
    
    getInvoiceTasksData: InvoiceTasksData!
  }



`