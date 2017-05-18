import React from 'react'
import { Link } from 'react-router-dom'

export default function Tr({sale, deleteSale}) {
  
  return (
    <tr>
      <td>{sale.name}</td>
      <td>{sale.date}</td>
      <td>{sale.status}</td>
      <td>{sale.description}</td>
      <td>
        <button className="ui icon basic button red" onClick={deleteSale(sale._id)}><i className="delete icon"></i></button>
        <Link to={`/sales/${sale._id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  sale: React.PropTypes.object.isRequired,
  deleteSale: React.PropTypes.func.isRequired
}