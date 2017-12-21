import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ conversations }) {
  const emptyMessage = (
    <div className="ui info message">
      <h3>{T.translate("conversations.page.empty_conversations_header")}</h3>
      <p>{T.translate("conversations.page.empty_conversations_message")}</p>
    </div>
  )

  const conversationsList = (
    <table className="ui very compact striped selectable table">
      <thead>
        <tr>
          <th>{T.translate("conversations.page.title")}</th>
          <th>{T.translate("conversations.page.recipient")}</th>
          <th>{T.translate("conversations.page.body")}</th>
          <th>{T.translate("conversations.page.delete")}</th>
        </tr>
      </thead>
      <tbody>
        { conversations.map(conversation => <Tr conversation={conversation} key={conversation._id} />) }
      </tbody>
    </table>
  )

  return (
    <div>
      { conversations.length === 0 ? emptyMessage : conversationsList }
    </div>   
  )
}

List.propTypes = {
  conversations: PropTypes.array.isRequired
}