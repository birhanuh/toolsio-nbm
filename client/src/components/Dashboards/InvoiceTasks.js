import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { fetchInvoiceTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class InvoiceTasks extends Component {
  
  state = {
    isLoading: false
  }

  componentDidMount() {
    this.props.fetchInvoiceTasks()
      .catch( ({response}) => this.setState({ invoiceTasks: { isLoading: true} }) )
  }
  
  render() {
    
    const { invoiceTasks } = this.props
    
    let pendingNotification   
    let pendingInvoices 

    let overdueNotification   
    let overdueInvoices 

    invoiceTasks && invoiceTasks.map(task => {

      if (task._id === 'pending') {
        pendingNotification = (<div key={task._id} className="ui info message">
            <div className="description">
              {T.translate("dashboards.invoice_tasks.pending_invoices", {count: task.count})}
            </div>
          </div>
          )
        
        pendingInvoices = task.invoices.map(invoice => 
          <Link key={invoice._id} to={`/invoices/show/${invoice._id}`} className="item blue">{invoice.referenceNumber}</Link>
        )  
      } else if (task._id !== 'pending' && task._id !== 'overdue') {
        pendingNotification = (<div key={"no-new"} className="ui info message">
            <div className="description">
              {T.translate("dashboards.invoice_tasks.no_pending_invoices")}
            </div>
          </div>
          )
      }

      if (task._id === 'overdue') {
        overdueNotification = (<div key={task._id} className="ui negative message">
            <div className="description">
              {T.translate("dashboards.invoice_tasks.overdued_invoices", {count: task.count})}
            </div>
          </div>
          )
        
        overdueInvoices = task.invoices.map(invoice => 
          <Link key={invoice._id} to={`/invoices/show/${invoice._id}`} className="item red">{invoice.referenceNumber}</Link>
        )  
      } else if (task._id !== 'overdue' && task._id !== 'pending') {
        overdueNotification = (<div key={"no-overdue"} className="ui negative message">
            <div className="description">
              {T.translate("dashboards.invoice_tasks.no_overdued_invoices")}
            </div>
          </div>
          )
      }

      })

    const lists =  (<div className="content">
      {pendingNotification}
      <div className="ui ordered list">
        {pendingInvoices}
      </div>

      <div className="ui divider"></div>

      {overdueNotification}
      <div className="ui ordered list">
        {overdueInvoices}
      </div>

      </div>)

    return (
      
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.invoice_tasks.header")}</h4>
        <div className="ui card">
          
            {lists}
          
        </div>
      </div>  
      )
  }
}

InvoiceTasks.propTypes = {
  fetchInvoiceTasks: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    invoiceTasks: state.dashboards.invoiceTasks
  }
}

export default connect(mapStateToProps, { fetchInvoiceTasks }) (InvoiceTasks)
