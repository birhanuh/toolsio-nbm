import axios from 'axios'
import { SET_TOTAL_INCOME, SET_INCOMES, SET_PROJECSTS, SET_SALES, SET_INVOICES, SET_CUSTOERMS, SET_PROJECT_TASKS, SET_SALE_TASKS, SET_INVOICE_TASKS } from './types'

// Action creators
export function setTotalIncome(totalIncome) {
  return {
    type: SET_TOTAL_INCOME,
    totalIncome
  }
}

export function setIncomes(incomes) {
  return {
    type: SET_INCOMES,
    incomes
  }
}

export function setProjects(projects) {
  return {
    type: SET_PROJECTS,
    projects
  }
}

export function setSales(sales) {
  return {
    type: SET_SALES,
    sales
  }
}

export function setInvoices(invoices) {
  return {
    type: SET_INVOICES,
    invoices
  }
}

export function setCustomers(customers) {
  return {
    type: SET_CUSTOERMS,
    customers
  }
}

export function setProjectTasks(projectTasks) {
  return {
    type: SET_PROJECT_TASKS,
    projectTasks
  }
}

export function setSaleTasks(saleTasks) {
  return {
    type: SET_SALE_TASKS,
    saleTasks
  }
}

export function setInvoiceTasks(invoiceTasks) {
  return {
    type: SET_INVOICE_TASKS,
    invoiceTasks
  }
}

// Thunk actions
export function fetchTotalIncome() {
  return dispatch => {
    return axios.get('/api/dashboards/total-ncome')
      .then(res => {
        dispatch(setTotalIncome(res.data.result))
      })
  }
}

export function fetchIncomes() {
  return dispatch => {
    return axios.get('/api/dashboards/incomes')
      .then(res => {
        dispatch(setIncomes(res.data.result))
      })
  }
}

export function fetchProjects() {
  return dispatch => {
    return axios.get('/api/dashboards/projects')
      .then(res => {
        dispatch(setProjects(res.data.result))
      })
  }
}

export function fetchSales() {
  return dispatch => {
    return axios.get('/api/dashboards/sales')
      .then(res => {
        dispatch(setSales(res.data.result))
      })
  }
}

export function fetchInvoices() {
  return dispatch => {
    return axios.get('/api/dashboards/invoices')
      .then(res => {
        dispatch(setInvoices(res.data.result))
      })
  }
}

export function fetchCustomers() {
  return dispatch => {
    return axios.get('/api/dashboards/customers')
      .then(res => {
        dispatch(setCustomers(res.data.result))
      })
  }
}

export function fetchProjectTasks() {
  return dispatch => {
    return axios.get('/api/dashboards/project-tasks')
      .then(res => {
        dispatch(setProjectTasks(res.data.result))
      })
  }
}

export function fetchSaleTasks() {
  return dispatch => {
    return axios.get('/api/dashboards/sale-tasks')
      .then(res => {
        dispatch(setSaleTasks(res.data.result))
      })
  }
}

export function fetchInvoiceTasks() {
  return dispatch => {
    return axios.get('/api/dashboards/invoice-tasks')
      .then(res => {
        dispatch(setInvoiceTasks(res.data.result))
      })
  }
}




