import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ users }) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colSpan="4" className="p-3">
          <div className="ui info message">
            <div className="header">{T.translate("users.list.empty_users_header")}</div>
            <p>{T.translate("users.list.empty_users_message")}</p>
          </div>
        </td>
      </tr>
    </tbody>
  )

  const usersList = (
    <tbody>
      { users.map(user => <Tr user={user} key={user.id} />) }
    </tbody>   
    
  )

  return (
    <table className="ui very compact striped center aligned table">
       <thead>
          <tr>
            <th>{T.translate("users.list.email")}</th>
            <th>{T.translate("users.list.invitation_accepted")}</th>
          </tr>
        </thead>
        
        { users.length === 0 ? emptyMessage : usersList }
      
    </table>
  )
}

List.propTypes = {
  users: PropTypes.array.isRequired
}