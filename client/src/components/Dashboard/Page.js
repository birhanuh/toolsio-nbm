import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-reduxt'
import { fetchTotalIncome, fetchIncomes, fetchProjects, fetchSales, fetchCustomers, fetchInvoices, fetchProjectTasks, fetchSaleTasks, fetchInvoiceTasks } from '../../actions/dashboardActions'
import Card from './Card'

class Page extends Component {
  
  componentDidMount() {
    this.props.fetchTotalIncome()
    this.props.fetchIncomes()
    this.props.fetchProjects()
    this.props.fetchSales()
    this.props.fetchCustomers()
    this.props.fetchInvoices()
    this.props.fetchProjectTasks()
    this.props.fetchSaleTasks()
    this.props.fetchInvoiceTasks()
  }

  render() {
    let buttonDisabled = this.state.model === null || this.state.brand === null
    let selectDisabled = this.state.brand === null

    return ( 
      <div className="row column">  

        <Breadcrumb />

        <Card totalIncome={fetchTotalIncome} income={fetchIncomes} projects={fetchProjects} sales={fetchSales} customers={fetchCustomers}
          invoices={fetchInvoices} projectTasks={fetchProjectTasks} saleTasks={fetchSaleTasks} invoiceTasks={fetchInvoiceTasks} />

      </div>  
    )
  }  
}

Page.propTypes = {
  fetchTotalIncome: PropTypes.object.isRequired,
  fetchIncomes: PropTypes.object.isRequired,
  fetchProjects: PropTypes.object.isRequired,
  fetchSales: PropTypes.object.isRequired,
  fetchCustomers: PropTypes.object.isRequired,
  fetchInvoices: PropTypes.object.isRequired,
  fetchProjectTasks: PropTypes.object.isRequired,
  fetchSaleTasks: PropTypes.object.isRequired,
  fetchInvoiceTasks: PropTypes.object.isRequired
}

function mapsStateToProps(state) {
  // totalIncome: state.dashboard.totalIncome,
  // incomes: state.dashboard.incomes,
  // projects: state.dashboard.projects,
  // sales: state.dashboard.sales,
  // customers: state.dashboard.customers,
  // invoices: state.dashboard.invoices,
  // projectTasks: state.dashboard.projectTasks,
  // saleTasks: state.dashboard.saleTasks,
  // invoiceTasks: state.dashboard.invoiceTasks
  dashboard: state.dashboard
}

export default connect(mapsStateToProps, { fetchTotalIncome, fetchIncomes, fetchProjects, fetchSales, fetchCustomers, fetchInvoices, fetchProjectTasks, fetchSaleTasks, fetchInvoiceTasks })(Page)

