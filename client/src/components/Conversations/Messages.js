import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import MessageForm from './Form/Message'
import UsersForm from './Form/Users'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

class Messages extends Component {

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

    const { getChannel } = this.props.getChannelQuery
    
    const { getChannelMessages } = this.props.getChannelMessagesQuery

    const emptyMessage = (
      <div className="ui info message mt-5">
        <h3>{T.translate(`conversations.messages.empty_message_header`)}</h3>
        <p>{T.translate(`conversations.messages.empty_message_message`)}</p>
      </div>
    )

    const messagesList = getChannelMessages && getChannelMessages.map(message => 
      <div key={message.id} className="comment">
        <a className="avatar">
          {!!message.user.avatarUrl ? <img src={message.user.avatarUrl} alt="avatar-url-small" /> : <img src={avatarPlaceholderSmall}
          alt="avatar-placeholder-small" />}
        </a>
        <div className="content">
          <a className="author">{message.user.email}</a>
          <div className="metadata">
            <span className="date">{message.createdAt}</span>
          </div>
          <div className="text">
            {message.message}
          </div>
        </div>
      </div>
    )

    return (
      <div className="messages">

        <div className="ui clearing vertical segment border-bottom-none">
          <div className="ui left floated header">
            <h3 className="header">{getChannel && getChannel.name}</h3>
          </div>  

          <button id="add-member" className="ui right floated primary button" onClick={this.showConfirmationModal.bind(this)}>
            <i className="add circle icon"></i>
            {T.translate("conversations.messages.add_member")}
          </button>        
        </div>   

        <div className="ui divider mt-0"></div>

        <div className="ui comments">

          { getChannelMessages && getChannelMessages.length === 0 ? emptyMessage : messagesList }

        </div>   
        
        <MessageForm channelId={this.props.channelId} />

        <div className="ui small modal add-member">
          <div className="header">{T.translate("conversations.messages.add_member")}</div>
          <div className="content">

            <UsersForm channelId={this.props.channelId} />
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("sales.show.cancel")}</button>
          </div>
        </div>
      </div>
    ) 
  }
}

const getChannelQuery = gql`
  query getChannel($id: Int!) {
    getChannel(id: $id) {
      id
      name
      users {
        id
        email
      }
    }
  }
`

const getChannelMessagesQuery = gql`
  query getChannelMessages($channelId: Int!) {
    getChannelMessages(channelId: $channelId) {
      id
      message
      userId
      isRead
      createdAt
      user {
        id
        email
        avatarUrl
      }
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(getChannelQuery, {
    "name": "getChannelQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.channelId)
      }
    })
  }),
  graphql(getChannelMessagesQuery, {
    "name": "getChannelMessagesQuery",
    options: (props) => ({
      variables: {
        channelId: parseInt(props.channelId)
      }
    })
  })
)(Messages)

export default MutationsAndQuery


