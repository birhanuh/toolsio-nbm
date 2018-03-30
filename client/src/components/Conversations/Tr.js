import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Tr({ message, account, type }) {

  const handleDelete = (id, event) => {
    event.preventDefault()
     
  }

  return (

    <tr>
      <td>
        <Link to={ !!type ? `/conversations/${type}/show/${message.id}` : `/conversations/show/${message.id}`}>
          {message.isRead ? message.title : <strong>{message.title}</strong>}
        </Link>  
      </td>
      <td>{message.isRead ? message.id : <strong>{message.id}</strong> }</td>
      <td>{message.isRead ? message.body : <strong>{message.body}</strong> }</td>      
      <td className="ui center aligned">
        <button className="ui icon basic mini button red" onClick={handleDelete.bind(this, message.id)}><i className="trash icon"></i></button>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  message: PropTypes.object.isRequired
}