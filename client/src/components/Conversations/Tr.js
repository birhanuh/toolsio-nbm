import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({conversation, deleteConversation, account}) {
  
  let conversationTypePath

  if (conversation.author._id === account._id) {
    conversationTypePath = `/conversations/sent/show/${conversation.conversationId}`
  } else if (conversation.author._id !== account._id) {
    conversationTypePath = `/conversations/inbox/show/${conversation.conversationId}`
  }

  return (

    <tr>
      <td>
        <Link to={conversationTypePath}>
          {conversation.isRead ? conversation.title : <strong>{conversation.title}</strong>}
        </Link>  
      </td>
      <td>{conversation.isRead ? conversation._id : <strong>{conversation._id}</strong> }</td>
      <td>{conversation.isRead ? conversation.body : <strong>{conversation.body}</strong> }</td>      
      <td className="ui center aligned">
        <button className="ui icon basic mini button red" onClick={deleteConversation(conversation._id)}><i className="trash icon"></i></button>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  conversation: PropTypes.object.isRequired,
  deleteConversation: PropTypes.func.isRequired
}