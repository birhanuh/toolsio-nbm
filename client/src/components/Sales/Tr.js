import React from 'react'
import { Link } from 'react-router-dom'

export default function Tr({sale}) {
  
  return (
    <tr>
      <td>{sale.name}</td>
      <td>{sale.date}</td>
      <td>{sale.status}</td>
      <td>{sale.description}</td>
      <td>
        <button className="ui icon basic button red"><i className="delete icon"></i></button>
        <Link to={`/sale/${sale._id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  sale: React.PropTypes.object.isRequired
}