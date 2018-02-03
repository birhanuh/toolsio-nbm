import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Card({...props}) {
  
  const { totalIncome, projectTasks, saleTasks, invoiceTasks } = props
  console.log('saleTasks ', saleTasks)
  const totalIncomeContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.total_income")}</h4>
        <div className="ui card">
          <div className="content">
      
          </div>
        </div>
      </div>  
      )

  const projectTasksContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.project_tasks")}</h4>
        <div className="ui card">
          <div className="content">
            
          </div>
        </div>
      </div>  
      )

  const saleTasksContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.sale_tasks")}</h4>
        <div className="ui card">
          <div className="content">
      
          </div>
        </div>
      </div>  
      )

  const invoiceTasksContent = (
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.invoice_tasks")}</h4>
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