import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { fetchInvoiceTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class InvoiceTasks extends Component {
  
  state = {
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.invoiceTasks) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.props.fetchInvoiceTasks()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }
  
  render() {
    
    const { isLoading } = this.state
    const { invoiceTasks } = this.props
    
    let pendingNotification   
    let pendingInvoices 

    let overdueNotification   
    let overdueInvoices 

    invoiceTasks && invoiceTasks.pendingOverdue.map(task => {

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

    const list = (<div className="content">
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
      
      <div className={classnames("dashboards form", { loading: isLoading })}>
        <h4 className="ui header">{T.translate("dashboards.invoice_tasks.header")}</h4>
        <div className="ui card">
          
          {(!!invoiceTasks || (invoiceTasks && invoiceTasks.total && invoiceTasks.total.count === 0)) ? 
            <div className="content">
              <div className="ui info message">
                <div className="description">
                  {T.translate("dashboards.invoice_tasks.no_invoices")}
                </div>
              </div> 
            </div> : list }
          
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
