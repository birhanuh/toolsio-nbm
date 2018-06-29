import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Query } from "react-apollo"
import { GET_INVOICE_TASKS_DATA } from '../../graphql/dashboard'

// Localization 
import T from 'i18n-react'

const InvoiceTasksCard = () => (
  <Query query={GET_INVOICE_TASKS_DATA}>
    {({ loading, error, data }) => {
    
    const countStatus = data.getInvoiceTasksData && data.getInvoiceTasksData.countStatus
    const idProjectStatus = data.getInvoiceTasksData && data.getInvoiceTasksData.idProjectStatus
    const idSaleStatus = data.getInvoiceTasksData && data.getInvoiceTasksData.idSaleStatus
  
    let newNotification  
    let overdueNotification 

    let newInvoices = []
    let overdueInvoices = []

    countStatus && countStatus.map(item => {
      if (item.status === 'pending') {
        newNotification = (<div className="ui warning message">
          <div className="description">
            {T.translate("dashboard.invoice_tasks.pending_invoices", {count: item.count})}
          </div>
        </div>)
      } 

      if (item.status === 'overdue') {
        overdueNotification = (<div className="ui negative message">
          <div className="description">
            {T.translate("dashboard.invoice_tasks.overdue_invoices", {count: item.count})}
          </div>
        </div>)
      }  
    })

    idProjectStatus && idProjectStatus.map(invoice => {
      if(invoice.status === 'pending') {
        newInvoices.push(invoice)
      } else if (invoice.status === 'overdue') {
        overdueInvoices.push(invoice)
      }
    })

    idSaleStatus && idSaleStatus.map(invoice => {
      if(invoice.status === 'pending') {
        newInvoices.push(invoice)
      } else if (invoice.status === 'overdue') {
        overdueInvoices.push(invoice)
      }
    })

    const list = (<div className="content">
      {newNotification}
      <div className="ui ordered list">
        {newInvoices && newInvoices.map(invoice => <Link key={invoice.id} to={`/invoices/show/${invoice.id}`} className="item orange">{'Invoice of '+invoice.name}</Link>)}
      </div>

      <div className="ui divider"></div>

      {overdueNotification}
      <div className="ui ordered list">
        {overdueInvoices && overdueInvoices.map(invoice => <Link key={invoice.id} to={`/invoices/show/${invoice.id}`} className="item red">{'Invoice of '+invoice.name}</Link>)}
      </div>

      </div>)

    return (      
      <div id="invoiceTask" className={classnames("dashboard", { loading: loading })}>
        <h4 className="ui header">{T.translate("dashboard.invoice_tasks.header")}</h4>
        <div className="ui card">
          
          {(countStatus && countStatus.length === 0) ?
            <div className="content">
              { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
              <div className="ui info message">
                <div className="description">
                  <p>{T.translate("dashboard.invoice_tasks.no_pending_invoices")}</p>
                  <p>{T.translate("dashboard.invoice_tasks.no_overdue_invoices")}</p>
                </div>
              </div> 
            </div> : list }
          
        </div>
      </div>  
      )
    }}
  </Query>
)

export default InvoiceTasksCard
