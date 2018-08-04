import React from 'react'
import PropTypes from 'prop-types'
// Semantic React UI
import { Table, Message, Header } from 'semantic-ui-react'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ users }) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colSpan="4" className="p-3">
          <Message info>
            <Header as="h1">{T.translate("users.list.empty_users_header")}</Header>
            <p>{T.translate("users.list.empty_users_message")}</p>
          </Message>
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
    <Table compact="very" striped>
       <thead>
          <tr>
            <th>{T.translate("users.list.email")}</th>
            <th style={{textAlign: 'center'}}>{T.translate("users.list.invitation_accepted")}</th>
          </tr>
        </thead>
        
        { users.length === 0 ? emptyMessage : usersList }
      
    </Table>
  )
}

List.propTypes = {
  users: PropTypes.array.isRequired
}