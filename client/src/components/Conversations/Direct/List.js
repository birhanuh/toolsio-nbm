import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

// jQuery
import $ from 'jquery'
// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

import UsersDownshift from './Form/UsersDownshift'
class List extends Component {

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.add-user').modal('show')
  }

  hideConfirmationModal(event) {
    if (event) {
      event.preventDefault()  
    }

    // Close modal
    $('.small.modal.add-user').modal('hide')
  }

  render() {
    
    const { data: { getDirectMessageUsers }, receiverId } = this.props

    const userList = getDirectMessageUsers && getDirectMessageUsers.map(user => 
      <Link key={user.id} to={`/conversations/receiver/${user.id}`} 
        className={classnames('item', {active: receiverId && parseInt(receiverId) === user.id})}>

        <div>
          <i className="user icon"></i>&nbsp;
          {user.first_name}
        </div>
      </Link>
    )
    console.log('user ', userList)
    return (
      <div>

        <div className="ui center aligned vertical segment">
          <button id="add-user" className="ui primary button" onClick={this.showConfirmationModal.bind(this)}>
            <i className="add circle icon"></i>
            {T.translate("conversations.messages.add_user")}
          </button>  
        </div>

        { userList }        

        <div className="ui small modal add-user">
          <div className="header">{T.translate("conversations.messages.add_user")}</div>
          <div className="content">

            <UsersDownshift onClose={this.hideConfirmationModal.bind(this)} />

          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("conversations.form.cancel")}</button>
          </div>
        </div>
      </div>
    )
  }
}

const getDirectMessageUsersQuery = gql`
  {
    getDirectMessageUsers {
      id
      first_name
      email
    }
  }
`

export default graphql(getDirectMessageUsersQuery)(List)



