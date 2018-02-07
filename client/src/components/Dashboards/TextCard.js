import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function TextCard({...props}) {
  
  const { totalIncome, projectTasks, saleTasks, invoiceTasks } = props
  
  const totalIncomeContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.total_income.header")}</h4>
        <div className="ui card" style={{height: '285px', display: 'table'}}>
          <div className="content" style={{display: 'table-cell', verticalAlign: 'middle'}}>
            <h1 className="ui header green centered bold">{totalIncome && totalIncome[0].sum}</h1>
            <div className="description center aligned">{T.translate("dashboards.total_income.description")}</div>
          </div>
        </div>
      </div>  
      )

  const projectTasksContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.project_tasks.header")}</h4>
        <div className="ui card">
          <div className="content">
            
          </div>
        </div>
      </div>  
      )

  const saleTasksContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.sale_tasks.header")}</h4>
        <div className="ui card">
          <div className="content">
      
          </div>
        </div>
      </div>  
      )

  const invoiceTasksContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.invoice_tasks.header")}</h4>
        <div className="ui card">
          <div className="content">
      
          </div>
        </div>
      </div>  
      )

  return (
    
    <div>
      {totalIncome && totalIncomeContent}
      {projectTasks && projectTasksContent}
      {saleTasks && saleTasksContent}
      {invoiceTasks && invoiceTasksContent}
    </div>
  )
}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }