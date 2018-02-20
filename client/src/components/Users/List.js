import React from 'react'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ users}) {
  const emptyMessage = (
    <p className="ui info message">{T.translate("account.users.empty_users")}</p>
  )

  const usersList = (
    <table className="ui very compact striped selectable table">
       <thead>
          <tr>
            <th>{T.translate("account.users.first_name")}</th>
            <th>{T.translate("account.users.last_name")}</th>
            <th>{T.translate("account.users.email")}</th>
            <th>{T.translate("account.users.accepted")}</th>
          </tr>
        </thead>
        <tbody>
          { users.map(user => <Tr user={user} key={user._id} />) }
        </tbody>
    </table>
  )

  return (
    <div>
      { users.length === 0 ? emptyMessage : usersList }
    </div>   
  )
}

List.propTypes = {
  users: React.PropTypes.array.isRequired
}