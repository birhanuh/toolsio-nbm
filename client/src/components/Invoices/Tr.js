import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({invoice}) {
  
  return (
    <tr>
      <td>{invoice.sale && invoice.sale.name} {invoice.project && invoice.project.name}</td>
      <td>{invoice.deadline}</td>
      <td>{invoice.customer && invoice.customer.name}</td>
      <td>{invoice.project && invoice.project.total}{invoice.sale && invoice.sale.total}</td>
      <td>
        <div className={classnames("ui uppercase tiny label", {orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
          {invoice.status}
        </div>
      </td>
      <td>
        <div className="ui small buttons">
          <Link to={`/invoices/edit/${invoice._id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
          <Link to={`/invoices/show/${invoice._id}`} className="ui icon basic blue button"><i className="unhide icon"></i></Link>
        </div>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  invoice: PropTypes.object.isRequired
}