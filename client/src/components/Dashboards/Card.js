import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Card({dashboards}) {
  
  const { totalIncome, incomes, projects, sales, customers, invoices, projectTasks, saleTasks, invoiceTasks } = dashboards

  return (

    <div className="card">
      <div className="content">
        

      </div>
    </div>

  )
}

Card.propTypes = {
  dashboards: PropTypes.object.isRequired
}