import React from 'react'
import PropTypes from 'prop-types'

import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ conversations, deleteConversation, account }) {

  const emptyMessage = (
    <div className="ui info message">
      <h3>{T.translate("conversations.page.empty_conversations_header")}</h3>
      <p>{T.translate("conversations.page.empty_conversations_message")}</p>
    </div>
  )

  const emptyInboxOrSent = (
    <div className="ui center aligned info message m-3">{T.translate("conversations.page.empty_conversations_header")}</div>
  )

  const conversationsList = (
    <div className="p-3"> 
      <table className="ui very compact striped selectable table">
        <thead>
          <tr>
            <th>{T.translate("conversations.page.title")}</th>
            <th>{T.translate("conversations.page.sender")}</th>
            <th>{T.translate("conversations.page.body")}</th>
            <th>{T.translate("conversations.page.remove")}</th>
          </tr>
        </thead>
        <tbody>
          { conversations.map(conversation => conversation.length !== 0 ? <Tr conversation={conversation[0]} key={conversation[0]._id} deleteConversation={deleteConversation} account={account} /> : <tr key="empty-inbox-or-sent"><td colSpan="4">{emptyInboxOrSent}</td></tr> ) }
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      { conversations.length === 0 ? emptyMessage : conversationsList }
    </div>   
  )
  

}

List.propTypes = {
  conversations: PropTypes.array.isRequired,
  deleteConversation: PropTypes.func.isRequired
}


