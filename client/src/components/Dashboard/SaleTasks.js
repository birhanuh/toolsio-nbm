import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Card, Header, List, Message, Divider } from 'semantic-ui-react'
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
        newNotification = (<Message info>
          <Message.Content>
            {T.translate("dashboard.sale_tasks.new_sales", {count: item.count})}
          </Message.Content>
        </Message>)
      } 

      if (item.status === 'delayed') {
        delayedNotification = (<Message negative>
          <Message.Content>
            {T.translate("dashboard.sale_tasks.delayed_sales", {count: item.count})}
          </Message.Content>
        </Message>)
      }  
    })

    idNameStatus && idNameStatus.map(sale => {
      if(sale.status === 'new') {
        newSales.push(sale)
      } else if (sale.status === 'delayed') {
        delayedSales.push(sale)
      }
    })
  
    const list = (<Card.Content>
        {newNotification}
         <List ordered>
          {newSales && newSales.map(sale => 
            <List.Item key={sale.id} content={<Link to={`/sales/show/${sale.id}`} className="item blue">{sale.name}</Link>} /> )}
          </List>

        <Divider />

        {delayedNotification}
        <List ordered>
          {delayedSales && delayedSales.map(sale => 
             <List.Item key={sale.id} content={<Link to={`/sales/show/${sale.id}`} className="item red">{sale.name}</Link>} /> )}
        </List>
      </Card.Content>)

    return (
      
      <div id="saleTask" className={classnames("dashboard form", { loading: loading })}>
        <Header as='h4'>{T.translate("dashboard.sale_tasks.header")}</Header>
        <Card>
          
          {(countStatus && countStatus.length === 0) ?
            <Card.Content>
              { !!error && <Message negative><p>{error.message}</p></Message> } 
              <Message info>
                <Message.Content>
                  {T.translate("dashboard.sale_tasks.no_new_sales")}
                  {T.translate("dashboard.sale_tasks.no_delayed_sales")}
                </Message.Content>
              </Message> 
            </Card.Content> : list }
          
        </Card>
      </div>  
      )
    }}
  </Query>
)

export default SaleTasksCard

