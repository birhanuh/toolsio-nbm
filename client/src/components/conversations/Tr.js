import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({message, deleteMessage}) {
  
  return (
    <Link to={`/messages/show/${message._id}`}>
      <tr>
        <td>{message.title}</td>
        <td>{message.recipient}</td>
        <td>{message.body}</td>      
        <td>
          <button className="ui icon basic button red" onClick={deleteMessage(message._id)}><i className="delete icon"></i></button>
        </td>
      </tr>
    </Link>
  )
}

Tr.propTypes = {
  message: PropTypes.object.isRequired,
  deleteMessage: PropTypes.func.isRequired
}