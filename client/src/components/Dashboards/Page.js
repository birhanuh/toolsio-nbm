import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchTotalIncome, fetchIncomes, fetchProjects, fetchSales, fetchCustomers, fetchInvoices, fetchProjectTasks, fetchSaleTasks, fetchInvoiceTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'
import GraphCard from './GraphCard'
import TextCard from './TextCard'

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
     console.log('dashboards: ', this.props.dashboards)
    return ( 
      <div className="row column">  

        <Breadcrumb />

        <div className="ui four column grid">
          <div className="column">
            <TextCard dashboards={this.props.dashboards} />
          </div>
          <div className="column">
            <GraphCard dashboards={this.props.dashboards} />
          </div>
          <div className="column">
            <GraphCard dashboards={this.props.dashboards} />
          </div>
          <div className="column">  
            <GraphCard dashboards={this.props.dashboards} />
          </div>
        </div>

        <div className="ui two column grid">
          <div className="four wide column">
            <GraphCard dashboards={this.props.dashboards} />
          </div>
          <div className="twelve wide column">
            <GraphCard dashboards={this.props.dashboards} /> 
          </div>
        </div>

        <div className="ui three column grid">
          <div className="column">
            <TextCard dashboards={this.props.dashboards} />
          </div>
          <div className="column">
            <TextCard dashboards={this.props.dashboards} />
          </div>
          <div className="column">
            <TextCard dashboards={this.props.dashboards} />
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
    dashboards: state.dashboards
  }
}

export default connect(mapsStateToProps, { fetchTotalIncome, fetchIncomes, fetchProjects, fetchSales, fetchCustomers, fetchInvoices, fetchProjectTasks, fetchSaleTasks, fetchInvoiceTasks })(Page)

