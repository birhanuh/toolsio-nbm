import React  from 'react'
import { Header, Card, Message } from 'semantic-ui-react'
import classnames from 'classnames'
import { Query } from 'react-apollo'
import { GET_TOTAL_INCOME_DATA } from '../../graphql/dashboard'

// Localization 
import T from 'i18n-react'

const TotalIncomeCard = () => (
  <Query query={GET_TOTAL_INCOME_DATA}>
    {({ loading, error, data }) => {

      const { getTotalIncomeData } = data
      const tasksItemTotalSum = getTotalIncomeData && getTotalIncomeData.tasksTotalSum + getTotalIncomeData && getTotalIncomeData.itemsTotalSum

      return (
        <Card id="total-income" className={classnames("dashboard form", { loading })}>
          <Card.Content>
            <Card.Header>
              <Header as='h4'>
                {T.translate("dashboard.total_income.header")}
              </Header>
            </Card.Header>
          </Card.Content>
          <Card.Content style={{display: 'table-cell', verticalAlign: 'middle', borderTop: 'none'}}>
            <Header as='h1' className="green centered bold">{tasksItemTotalSum && tasksItemTotalSum}</Header>
            <Card.Description className="center aligned">{T.translate("dashboard.total_income.description")}</Card.Description>
          </Card.Content>
          <Card.Content style={{borderTop: 'none'}}>
            { !!error && <Message negative><p>{error.message}</p></Message> } 
          </Card.Content>
        </Card>
      )
    }}
  </Query>
)

export default TotalIncomeCard

