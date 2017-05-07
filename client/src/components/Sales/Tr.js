import React from 'react'

export default function Tr({sale}) {
  
  return (
    <tr>
      <td>{sale.name}</td>
      <td>{sale.date}</td>
      <td>{sale.status}</td>
      <td>{sale.description}</td>
    </tr>
  )
}

Tr.propTypes = {
  sale: React.PropTypes.object.isRequired
}