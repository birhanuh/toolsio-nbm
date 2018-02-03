import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Card({dashboards}) {
  
  const { totalIncome, projectTasks, saleTasks, invoiceTasks } = dashboards

  return (

    <div className="dashboards">
      <h4 className="ui header">Incomes</h4>
      <div className="ui card">
        <div className="content">
    
        </div>
      </div>
    </div>  
  )
}

Card.propTypes = {
  dashboards: PropTypes.object.isRequired
}