import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchConversations, fetchInboxOrSent, deleteConversation } from '../../actions/conversationActions'

import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export class List extends Component {

  componentDidMount() {

    // Fetch Inbox or sent by seeing what's present in params
    const { match } = this.props
    
    if (match.params.type === 'sent') {
      this.props.fetchInboxOrSent('sent')
    } else if (match.params.type === 'inbox') {
      this.props.fetchInboxOrSent('inbox')
    } else {
      this.props.fetchConversations()
    }

  }

  render() {
    const emptyMessage = (
      <div className="ui info message">
        <h3>{T.translate("conversations.page.empty_conversations_header")}</h3>
        <p>{T.translate("conversations.page.empty_conversations_message")}</p>
      </div>
    )

    const conversationsList = (
      <div className="p-3"> 
        <table className="ui very compact striped selectable table">
          <thead>
            <tr>
              <th>{T.translate("conversations.page.title")}</th>
              <th>{T.translate("conversations.page.recipient")}</th>
              <th>{T.translate("conversations.page.body")}</th>
              <th>{T.translate("conversations.page.remove")}</th>
            </tr>
          </thead>
          <tbody>
            { this.props.conversations.map(conversation => conversation.length !== 0 && <Tr conversation={conversation[0]} key={conversation[0]._id} deleteConversation={deleteConversation} />) }
          </tbody>
        </table>
      </div>
    )

    return (
      <div>
        { this.props.conversations.length === 0 ? emptyMessage : conversationsList }
      </div>   
    )
  }

}

List.propTypes = {
  fetchConversations: PropTypes.func.isRequired,
  fetchInboxOrSent: PropTypes.func.isRequired,
  deleteConversation: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  
  return {
    conversations: state.conversations
  }
}

export default connect(mapSateToProps, { fetchConversations, fetchInboxOrSent, deleteConversation }) (List)
