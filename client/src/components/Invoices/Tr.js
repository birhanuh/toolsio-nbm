import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import moment from 'moment'

export default function Tr({ invoice }) {
  
  return (
    <tr>
      <td>
        {invoice.project &&
          <Link to={`/projects/show/${invoice.project.id}`} className={classnames("ui", {blue: invoice.project.status === 'new', orange: invoice.project.status === 'in progress', green: invoice.project.status === 'finished' || invoice.project.status === 'delivered', red: invoice.project.status === 'delayed' })}>
            
            {invoice.project.name}
          </Link>
        }
        {invoice.sale &&
          <Link to={`/sales/show/${invoice.sale.id}`} className={classnames("ui", {blue: invoice.sale.status === 'new', orange: invoice.sale.status === 'in progress', green: invoice.sale.status === 'finished' || invoice.sale.status === 'delivered', red: invoice.sale.status === 'delayed' })}>
            
            {invoice.sale.name}
          </Link>
        }
      </td>
      <td>{moment(invoice.deadline).format("DD/MM/YYYY")}</td>
      <td>{invoice.customer.name}</td>
      <td>{invoice.total}</td>
      <td>
        <div className={classnames("ui tiny uppercase label", {blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
          {invoice.status}
        </div>  
      </td>
      <td>
        <div className="ui small buttons">
          <Link to={`/invoices/edit/${invoice.id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
          <Link to={`/invoices/show/${invoice.id}`} className="ui icon basic blue button"><i className="unhide icon"></i></Link>
        </div>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  invoice: PropTypes.object.isRequired
}