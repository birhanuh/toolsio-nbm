import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({ invoice }) {
  
  return (
    <tr>
      <td>{invoice.project.name || invoice.sale.name}</td>
      <td>{invoice.deadline}</td>
      <td>{invoice.customer.name}</td>
      <td>{invoice.total}</td>
      <td>{invoice.status}</td>
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