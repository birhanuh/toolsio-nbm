import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ users}) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colSpan="4" className="p-3">
          <div className="ui info message">
            <div className="header">{T.translate("account.users.empty_users_header")}</div>
            <p>{T.translate("account.users.empty_users_message")}</p>
          </div>
        </td>
      </tr>
    </tbody>
  )

  const usersList = (
    <tbody>
      { users.map(user => <Tr user={user} key={user._id} />) }
    </tbody>   
    
  )

  return (
    <table className="ui very compact striped selectable table">
       <thead>
          <tr>
            <th>{T.translate("account.users.first_name")}</th>
            <th>{T.translate("account.users.last_name")}</th>
            <th>{T.translate("account.users.email")}</th>
            <th>{T.translate("account.users.accepted")}</th>
          </tr>
        </thead>
        
        { users.length === 0 ? emptyMessage : usersList }
      
    </table>
  )
}

List.propTypes = {
  users: PropTypes.array.isRequired
}