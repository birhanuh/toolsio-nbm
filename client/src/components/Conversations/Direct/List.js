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
    $('.small.modal.add-member').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.add-member').modal('hide')
  }

  render() {
    
    const { data: { getUsers }, receiverId } = this.props
    
    const receiverList = getUsers && getUsers.map(receiver => 
      <Link key={receiver.id} to={`/conversations/receiver/${receiver.id}`} 
        className={classnames('item', {active: receiverId && parseInt(receiverId) === receiver.id})}>

        <div>
          <i className="user icon"></i>&nbsp;
          {receiver.firstName}
        </div>
      </Link>
    )

    return (
      <div>


        <div className="ui divider"></div>

        {receiverList}

        <div className="ui small modal add-member">
          <div className="header">{T.translate("conversations.messages.add_user")}</div>
          <div className="content">

            <UsersDownshift />
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("sales.show.cancel")}</button>
          </div>
        </div>
      </div>
    )
  }
}

const getUsersQuery = gql`
  {
    getUsers {
      id
      firstName
      email 
    }
  }
`
export default graphql(getUsersQuery)(List)



