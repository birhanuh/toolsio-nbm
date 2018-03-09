import axios from 'axios'
import { SET_DASHBOARDS_TOTAL_INCOME, SET_DASHBOARDS_INCOMES, SET_DASHBOARDS_PROJECTS, SET_DASHBOARDS_SALES, SET_DASHBOARDS_INVOICES, SET_DASHBOARDS_CUSTOMERS, SET_DASHBOARDS_PROJECT_TASKS, SET_DASHBOARDS_SALE_TASKS, SET_DASHBOARDS_INVOICE_TASKS } from './types'

// Action creators
export function setTotalIncome(totalIncome) {
  return {
    type: SET_DASHBOARDS_TOTAL_INCOME,
    totalIncome
  }
}

export function setIncomes(incomes) {
  return {
    type: SET_DASHBOARDS_INCOMES,
    incomes
  }
}

export function setProjects(projects) {
  return {
    type: SET_DASHBOARDS_PROJECTS,
    projects
  }
}

export function setSales(sales) {
  return {
    type: SET_DASHBOARDS_SALES,
    sales
  }
}

export function setInvoices(invoices) {
  return {
    type: SET_DASHBOARDS_INVOICES,
    invoices
  }
}

export function setCustomers(customers) {
  return {
    type: SET_DASHBOARDS_CUSTOMERS,
    customers
  }
}

export function setProjectTasks(projectTasks) {
  return {
    type: SET_DASHBOARDS_PROJECT_TASKS,
    projectTasks
  }
}

export function setSaleTasks(saleTasks) {
  return {
    type: SET_DASHBOARDS_SALE_TASKS,
    saleTasks
  }
}

export function setInvoiceTasks(invoiceTasks) {
  return {
    type: SET_DASHBOARDS_INVOICE_TASKS,
    invoiceTasks
  }
}

// Thunk actions
export function fetchTotalIncome() {
  return dispatch => {
    return axios.get('/api/dashboard?type=total-income')
      .then(res => {
        dispatch(setTotalIncome(res.data.results))
      })
  }
}

export function fetchIncomes() {
  return dispatch => {
    return axios.get('/api/dashboard?type=incomes')
      .then(res => {
        dispatch(setIncomes(res.data.results))
      })
  }
}

export function fetchProjects() {
  return dispatch => {
    return axios.get('/api/dashboard?type=projects')
      .then(res => {
        dispatch(setProjects(res.data.results))
      })
  }
}

export function fetchSales() {
  return dispatch => {
    return axios.get('/api/dashboard?type=sales')
      .then(res => {
        dispatch(setSales(res.data.results))
      })
  }
}

export function fetchInvoices() {
  return dispatch => {
    return axios.get('/api/dashboard?type=invoices')
      .then(res => {
        dispatch(setInvoices(res.data.results))
      })
  }
}

export function fetchCustomers() {
  return dispatch => {
    return axios.get('/api/dashboard?type=customers')
      .then(res => {
        dispatch(setCustomers(res.data.results))
      })
  }
}

export function fetchProjectTasks() {
  return dispatch => {
    return axios.get('/api/dashboard?type=project-tasks')
      .then(res => {
        dispatch(setProjectTasks(res.data.results))
      })
  }
}

export function fetchSaleTasks() {
  return dispatch => {
    return axios.get('/api/dashboard?type=sale-tasks')
      .then(res => {
        dispatch(setSaleTasks(res.data.results))
      })
  }
}

export function fetchInvoiceTasks() {
  return dispatch => {
    return axios.get('/api/dashboard?type=invoice-tasks')
      .then(res => {
        dispatch(setInvoiceTasks(res.data.results))
      })
  }
}




