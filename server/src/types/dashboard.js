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

  type IdNameStatus {
    id: Int!
    name: String!
    status: String!
  }

  type IdProjectStatus {
    id: Int!
    name: String
    status: String!
  }

  type IdSaleStatus {
    id: Int!
    name: String
    status: String!
  }

  type CountMonth {
    month: String!
    count: Int!
  }

  type CountStatusMonth {
    month: String!
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

  type NameCountProjectsSales {
    name: String!
    projectsSalesCount: Int!
  }

  type CustomersData {
    nameCountProjectsSales: [NameCountProjectsSales!]!
  }

  type InvoicesData {
    countMonth: [CountMonth]!
    countStatusMonth: [CountStatusMonth]! 
  }

  type ProjectTasksData {
    countStatus: [CountStatus!]!
    idNameStatus: [IdNameStatus!]!
  }

  type SaleTasksData {
    countStatus: [CountStatus!]!
    idNameStatus: [IdNameStatus!]!
  }

  type InvoiceTasksData {
    countStatus: [CountStatus!]!
    idProjectStatus: [IdProjectStatus!]!
    idSaleStatus: [IdSaleStatus!]!
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