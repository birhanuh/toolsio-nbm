import { SET_DASHBOARDS_TOTAL_INCOME, SET_DASHBOARDS_INCOMES, SET_DASHBOARDS_PROJECTS, SET_DASHBOARDS_SALES, SET_DASHBOARDS_INVOICES, SET_DASHBOARDS_CUSTOMERS, SET_DASHBOARDS_PROJECT_TASKS, SET_DASHBOARDS_SALE_TASKS, SET_DASHBOARDS_INVOICE_TASKS } from '../actions/types'

export default function dashboard(state={totalIncome: {}, incomes: {lastTwoMonths: []}, projects: {lastTwoMonths: []}, sales: {lastTwoMonths: []}, customers: {lastTwoMonths: []}, invoices: {lastTwoMonths: []}, projectTasks: {newDelayed: []}, saleTasks: {newDelayed: []}, invoiceTasks: {pendingOverdue: []}}, action={}) {

  switch(action.type) {
    case SET_DASHBOARDS_TOTAL_INCOME:
      return {
        ...state,
        totalIncome: action.totalIncome
      }
        
    case SET_DASHBOARDS_INCOMES:
      return {
        ...state,
        incomes: action.incomes
      }

    case SET_DASHBOARDS_PROJECTS:
      return {
        ...state,
        projects: action.projects
      }

    case SET_DASHBOARDS_SALES:
      return {
        ...state,
        sales: action.sales
      }

    case SET_DASHBOARDS_CUSTOMERS:
      return {
        ...state,
        customers: action.customers
      }

    case SET_DASHBOARDS_INVOICES:
      return {
        ...state,
        invoices: action.invoices
      }

    case SET_DASHBOARDS_PROJECT_TASKS:
      return {
        ...state,
        projectTasks: action.projectTasks
      }

    case SET_DASHBOARDS_SALE_TASKS:
      return {
        ...state,
        saleTasks: action.saleTasks
      }

    case SET_DASHBOARDS_INVOICE_TASKS:
      return {
        ...state,
        invoiceTasks: action.invoiceTasks
      }

    default: return state

  }
}