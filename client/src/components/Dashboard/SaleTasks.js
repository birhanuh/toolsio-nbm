import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import gql from "graphql-tag"
import { Query } from "react-apollo"

// Localization 
import T from 'i18n-react'

const GET_SALE_TASKS_DATA = gql`
  {
    getSaleTasksData {
      countStatus {
        status
        count
      }
      idNameStatus {
        id
        name 
        status
      }
    }
  }
`
const SaleTasksCard = () => (
  <Query query={GET_SALE_TASKS_DATA}>
    {({ loading, error, data }) => {
    
    const countStatus = data && data.getSaleTasksData && data.getSaleTasksData.countStatus
    const idNameStatus = data && data.getSaleTasksData && data.getSaleTasksData.idNameStatus

    let newNotification  
    let delayedNotification 

    let newSales = []
    let delayedSales = []

    countStatus && countStatus.map(item => {
      if (item.status === 'new') {
        newNotification = (<div className="ui info message">
          <div className="description">
            {T.translate("dashboard.sale_tasks.new_sales", {count: item.count})}
          </div>
        </div>)
      } 

      if (item.status === 'delayed') {
        delayedNotification = (<div className="ui negative message">
          <div className="description">
            {T.translate("dashboard.sale_tasks.delayed_sales", {count: item.count})}
          </div>
        </div>)
      }  
    })

    idNameStatus && idNameStatus.map(sale => {
      if(sale.status === 'new') {
        newSales.push(sale)
      } else if (sale.status === 'delayed') {
        delayedSales.push(sale)
      }
    })
  
    const list = (<div className="content">
      {newNotification}
      <div className="ui ordered list">
        {newSales && newSales.map(sale => <Link key={sale.id} to={`/sales/show/${sale.id}`} className="item blue">{sale.name}</Link>)}
      </div>

      <div className="ui divider"></div>

      {delayedNotification}
      <div className="ui ordered list">
        {delayedSales && delayedSales.map(sale => <Link key={sale.id} to={`/sales/show/${sale.id}`} className="item red">{sale.name}</Link>)}
      </div>

      </div>)

    return (
      
      <div className={classnames("dashboard", { loading: loading })}>
        <h4 className="ui header">{T.translate("dashboard.sale_tasks.header")}</h4>
        <div className="ui card">
          
          {(countStatus && countStatus.length === 0) ?
            <div className="content">
              { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
              <div className="ui info message">
                <div className="description">
                  {T.translate("dashboard.sale_tasks.no_new_sales")}
                  {T.translate("dashboard.sale_tasks.no_delayed_sales")}
                </div>
              </div> 
            </div> : list }
          
        </div>
      </div>  
      )
    }}
  </Query>
)

export default SaleTasksCard

