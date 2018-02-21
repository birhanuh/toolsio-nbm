import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({user}) {
  
  const accepted = user.accepted ? <i className="check green icon"></i> : <i className="check orange icon"></i>
  
  return (
    <tr>
      <td>{user.first_name}</td>
      <td>{user.last_name}</td>
      <td>{user.email}</td>
      <td><span>{accepted}</span></td>
    </tr>
  )
}

Tr.propTypes = {
  user: PropTypes.object.isRequired
}
