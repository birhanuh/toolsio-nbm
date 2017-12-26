import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({conversation, deleteConversation}) {
  
  return (
    
    <tr>
      <td>
        <Link to={`/conversations/show/${conversation._id}`}>
          {conversation.isRead ? conversation.title : <strong>{conversation.title}</strong>}
        </Link>  
      </td>
      <td>{conversation.isRead ? conversation._id : <strong>{conversation._id}</strong> }</td>
      <td>{conversation.isRead ? conversation.body : <strong>{conversation.body}</strong> }</td>      
      <td>
        <button className="ui icon basic mini button red" onClick={deleteConversation(conversation._id)}><i className="trash icon"></i></button>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  conversation: PropTypes.object.isRequired,
  deleteConversation: PropTypes.func.isRequired
}