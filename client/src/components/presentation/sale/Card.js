import React from 'react'

export default function Card({sale}) {
  
  return (
    <tr>
      <td>{sale.name}</td>
      <td>{sale.date}</td>
      <td>{sale.status}</td>
      <td>{sale.description}</td>
    </tr>
  )
}

Card.propTypes = {
  sale: React.PropTypes.object.isRequired
}