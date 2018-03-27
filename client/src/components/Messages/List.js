import React from 'react'
import PropTypes from 'prop-types'

import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ messages, account, type }) {

  const emptyMessage = (
    <div className="ui info message mt-5">
      <h3>{T.translate(`messages.list.empty_${type}_header`)}</h3>
      <p>{T.translate(`messages.list.empty_${type}_message`)}</p>
    </div>
  )
  
  const emptyInboxOrSent = (
    <div className="ui center aligned info message m-3">{T.translate("messages.page.empty_messages_header")}</div>
  )

  const messagesList = (
    <div className="p-3"> 
      <table className="ui very compact striped selectable table">
        <thead>
          <tr>
            <th>{T.translate("messages.page.title")}</th>
            <th>{T.translate("messages.page.from")}</th>
            <th>{T.translate("messages.page.body")}</th>
            <th className="ui center aligned">{T.translate("messages.page.remove")}</th>
          </tr>
        </thead>
        <tbody>
          { messages.map(message => <Tr message={message} key={message.id} account={account} type={type}/> )} 
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      { messages.length === 0 ? emptyMessage : messagesList }
    </div>   
  ) 

}

List.propTypes = {
  messages: PropTypes.array.isRequired
}


