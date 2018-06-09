import React  from 'react'
import classnames from 'classnames'
import { Query } from 'react-apollo'
import { GET_TOTAL_INCOME_DATA } from '../../graphql/dashboard'

// Localization 
import T from 'i18n-react'

const TotalIncomeCard = () => (
  <Query query={GET_TOTAL_INCOME_DATA}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <div className={classnames("ui card dashboard form", { loading })}>
          <div className="content">
            { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
            <h4 className="ui header body-color">
              {T.translate("dashboard.total_income.header")}
            </h4>
          </div>
          <div className="content" style={{display: 'table-cell', verticalAlign: 'middle', borderTop: 'none'}}>
            <h1 className="ui header green centered bold">{data.getTotalIncomeData.tasksTotalSum + data.getTotalIncomeData.itemsTotalSum}</h1>
            <div className="description center aligned">{T.translate("dashboard.total_income.description")}</div>
          </div>
        </div>
      )
    }}
  </Query>
)

export default TotalIncomeCard

