import React from 'react'
import { Link } from 'react-router-dom'

export default function Tr({customer, deleteCustomer}) {
  
  return (
    <tr>
      <td>{customer.name}</td>
      <td>{customer.vatNumber}</td>
      <td>{customer.contact.phoneNumber}{customer.contact.email}</td>
      <td>{customer.includeContactOnInvoice}</td>
      <td>
        <button className="ui icon basic button red" onClick={deleteCustomer(customer._id)}><i className="delete icon"></i></button>
        <Link to={`/customers/edit/${customer._id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
         <Link to={`/customers/show/${customer._id}`} className="ui icon basic blue button"><i className="unhide icon"></i></Link>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  customer: React.PropTypes.object.isRequired,
  deleteCustomer: React.PropTypes.func.isRequired
}