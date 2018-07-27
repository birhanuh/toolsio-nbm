import React from 'react'
import PropTypes from 'prop-types'

export default function Tr({user}) {
  
  const accepted = user.isInvitationAccepted ? <i className="check green icon"></i> : <i className="close red icon"></i>
  
  return (
    <tr key={user.id}>
      <td>{user.email}</td>
      <td><span>{accepted}</span></td>
    </tr>
  )
}

Tr.propTypes = {
  user: PropTypes.object.isRequired
}
