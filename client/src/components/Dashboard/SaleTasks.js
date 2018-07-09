import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { List } from 'semantic-ui-react'
import { Query } from 'react-apollo'
import { GET_SALE_TASKS_DATA } from '../../graphql/dashboard'

// Localization 
import T from 'i18n-react'

const SaleTasksCard = () => (
  <Query query={GET_SALE_TASKS_DATA}>
    {({ loading, error, data }) => {
    
    const countStatus = data.getSaleTasksData && data.getSaleTasksData.countStatus
    const idNameStatus = data.getSaleTasksData && data.getSaleTasksData.idNameStatus

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
         <List ordered>
          {newSales && newSales.map(sale => 
            <List.Item key={sale.id} content={<Link to={`/sales/show/${sale.id}`} className="item blue">{sale.name}</Link>} /> )}
          </List>

        <div className="ui divider"></div>

        {delayedNotification}
        <List ordered>
          {delayedSales && delayedSales.map(sale => 
             <List.Item key={sale.id} content={<Link to={`/sales/show/${sale.id}`} className="item red">{sale.name}</Link>} /> )}
        </List>
      </div>)

    return (
      
      <div id="saleTask" className={classnames("dashboard", { loading: loading })}>
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

