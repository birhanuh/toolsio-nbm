import React from 'react'
import PropTypes from 'prop-types'

export default function Tr({user}) {
  
  const accepted = user.accepted ? <i className="check green icon"></i> : <i className="check orange icon"></i>
  
  return (
    <tr>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td><span>{accepted}</span></td>
    </tr>
  )
}

Tr.propTypes = {
  user: PropTypes.object.isRequired
}
