import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Card({project}) {
  
  return (
    <div className="card">
      <div className="content">
        

      </div>
    </div>

  )
}

Card.propTypes = {
  totalIncome: PropTypes.object.isRequired,
  incomes: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  sales: PropTypes.object.isRequired,
  customers: PropTypes.object.isRequired,
  invoices: PropTypes.object.isRequired,
  projectTasks: PropTypes.object.isRequired,
  saleTasks: PropTypes.object.isRequired,
  invoiceTasks: PropTypes.object.isRequired
}