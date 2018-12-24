import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({ customer }) {
  
  return (
    <tr key={customer.id}>
      <td>{customer.name}</td>
      <td>{customer.vatNumber}</td>
      <td>{customer.phoneNumber}{customer.email}</td>
      <td>{}</td>
      <td>{}</td>
      <td>
        <div className="ui small buttons">
          <Link to={`/customers/edit/${customer.id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
          <Link to={`/customers/show/${customer.id}`} className="ui icon basic blue button"><i className="unhide icon"></i></Link>
        </div>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  customer: PropTypes.object.isRequired
}