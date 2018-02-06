import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchTotalIncome, fetchIncomes, fetchProjects, fetchSales, fetchCustomers, fetchInvoices, fetchProjectTasks, fetchSaleTasks, fetchInvoiceTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'
import IncomesCard from './IncomesCard'
import ProjectsCard from './ProjectsCard'
import SalesCard from './SalesCard'
import CustomersCard from './CustomersCard'
import InvoicesCard from './InvoicesCard'
import TextCard from './TextCard'

class Page extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      totalIncome: {
        data: this.props.totalIncome,
        isLoading: false
      },
      incomes: {
        data: this.props.incomes,
        isLoading: false
      },
      projects: {
        data: this.props.projects,
        isLoading: false
      },
      sales: {
        data: this.props.sales,
        isLoading: false
      },
      invoices: {
        data: this.props.invoices,
        isLoading: false
      },
      customers: {
        data: this.props.customers,
        isLoading: false
      },
      projectTasks: {
        data: this.props.projectTasks,
        isLoading: false
      },
      saleTasks: {
        data: this.props.saleTasks,
        isLoading: false
      },
      invoiceTasks: {
        data: this.props.invoiceTasks,
        isLoading: false
      }
    }
  }

  componentDidMount() {
    this.props.fetchTotalIncome()
      .catch( ({response}) => this.setState({ totalIncome: { isLoading: true} }) )
    this.props.fetchIncomes()
      .catch( ({response}) => this.setState({ incomes: { isLoading: true} }) )
    this.props.fetchProjects()
      .catch( ({response}) => this.setState({ projects: { isLoading: true} }) )
    this.props.fetchSales()
      .catch( ({response}) => this.setState({ sales: { isLoading: true} }) )
    this.props.fetchCustomers()
      .catch( ({response}) => this.setState({ invoices: { isLoading: true} }) )
    this.props.fetchInvoices()
      .catch( ({response}) => this.setState({ customers: { isLoading: true} }) )
    this.props.fetchProjectTasks()
      .catch( ({response}) => this.setState({ projectTasks: { isLoading: true} }) )
    this.props.fetchSaleTasks()
      .catch( ({response}) => this.setState({ saleTasks: { isLoading: true} }) )
    this.props.fetchInvoiceTasks()
      .catch( ({response}) => this.setState({ invoiceTasks: { isLoading: true} }) )
  }

  render() {
    
    const { totalIncome, incomes, projects, sales, customers, invoices, projectTasks, saleTasks, invoiceTasks } = this.props

    return ( 
      <div className="row column">  

        <Breadcrumb />

        <div className="ui four column grid">
          <div className="column">
            <TextCard totalIncome={totalIncome} />
          </div>
          <div className="column">
            <IncomesCard incomes={incomes} />
          </div>
          <div className="column">
            <ProjectsCard projects={projects} />
          </div>
          <div className="column">  
            <SalesCard sales={sales} />
          </div>
        </div>

        <div className="ui two column grid">
          <div className="four wide column">
            <CustomersCard customers={customers} />
          </div>
          <div className="twelve wide column">
            <InvoicesCard invoices={invoices} /> 
          </div>
        </div>

        <div className="ui three column grid">
          <div className="column">
            <TextCard projectTasks={projectTasks} />
          </div>
          <div className="column">
            <TextCard saleTasks={saleTasks} />
          </div>
          <div className="column">
            <TextCard invoiceTasks={invoiceTasks} />
          </div>
        </div>

      </div>  
    )
  }  
}

Page.propTypes = {
  fetchTotalIncome: PropTypes.func.isRequired,
  fetchIncomes: PropTypes.func.isRequired,
  fetchProjects: PropTypes.func.isRequired,
  fetchSales: PropTypes.func.isRequired,
  fetchCustomers: PropTypes.func.isRequired,
  fetchInvoices: PropTypes.func.isRequired,
  fetchProjectTasks: PropTypes.func.isRequired,
  fetchSaleTasks: PropTypes.func.isRequired,
  fetchInvoiceTasks: PropTypes.func.isRequired
}

function mapsStateToProps(state) {
  return {
    totalIncome: state.dashboards.totalIncome,
    incomes: state.dashboards.incomes,
    projects: state.dashboards.projects,
    sales: state.dashboards.sales,
    customers: state.dashboards.customers,
    invoices: state.dashboards.invoices,
    projectTasks: state.dashboards.projectTasks,
    saleTasks: state.dashboards.saleTasks,
    invoiceTasks: state.dashboards.invoiceTasks
  }
}

export default connect(mapsStateToProps, { fetchTotalIncome, fetchIncomes, fetchProjects, fetchSales, fetchCustomers, fetchInvoices, fetchProjectTasks, fetchSaleTasks, fetchInvoiceTasks })(Page)

