import React from 'react'
import PropTypes from 'prop-types'
// Semantic React UI
import { Icon } from 'semantic-ui-react'

export default function Tr({user}) {
  
  const accepted = user.isInvitationAccepted ? <Icon name="check" className="green" /> : <Icon name="close" className="red" />
  
  return (
    <tr key={user.id}>
      <td>{user.email}</td>
      <td style={{textAlign: 'center'}}><span>{accepted}</span></td>
    </tr>
  )
}

Tr.propTypes = {
  user: PropTypes.object.isRequired
}
