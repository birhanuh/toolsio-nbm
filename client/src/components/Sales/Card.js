import React from 'react'
import { Link } from 'react-router-dom'

export default function Card({sale, deleteSale}) {
  
  return (
    <div className="card">
      <div className="content">
        <div className="right floated mini ui">
          {sale.status}
        </div>
        <div className="header">
          {sale.name}
        </div>
        <div className="meta">
         {sale.deadline}
        </div>
        <div className="description">
         {sale.description}
        </div>
      </div>

      <div className="extra content">
        <div className="ui two buttons">
          <button className="ui icon basic red button" onClick={deleteSale(sale._id)}><i className="delete icon"></i></button>
          <Link to={`/sales/${sale._id}`} className="ui icon basic green button"><i className="edit icon"></i></Link>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  sale: React.PropTypes.object.isRequired,
  deleteSale: React.PropTypes.func.isRequired
}