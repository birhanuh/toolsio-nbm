import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({conversation, deleteConversation}) {
  
  return (
    
    <tr>
      <td>
        <Link to={`/conversations/show/${conversation._id}`}>
          {conversation._id}
        </Link>  
      </td>
      <td>{conversation._id}</td>
      <td>{conversation._id}</td>      
      <td>
        <button className="ui icon basic button red" onClick={deleteConversation(conversation._id)}><i className="delete icon"></i></button>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  conversation: PropTypes.object.isRequired,
  deleteConversation: PropTypes.func.isRequired
}