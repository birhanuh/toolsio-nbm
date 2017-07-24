import React from 'react'
import { Link } from 'react-router-dom'

export default function Tr({customer, deleteCustomer}) {
  
  return (
    <tr>
      <td>{customer.name}</td>
      <td>{customer.date}</td>
      <td>{customer.status}</td>
      <td>{customer.description}</td>
      <td>
        <button className="ui icon basic button red" onClick={deleteCustomer(customer._id)}><i className="delete icon"></i></button>
        <Link to={`/customers/${customer._id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  customer: React.PropTypes.object.isRequired,
  deleteCustomer: React.PropTypes.func.isRequired
}