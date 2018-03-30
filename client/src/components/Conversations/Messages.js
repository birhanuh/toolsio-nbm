import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import MessageForm from './Form/Message'

// Localization 
import T from 'i18n-react'

import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

class Messages extends Component {

  render() {

    const { getChannel, getChannelMessages } = this.props.data
    console.log('getChannel ', getChannel)
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
      <div className="ui comments">
        <h3 className="ui dividing header">{getChannel && getChannel.name}</h3>
        { getChannelMessages && getChannelMessages.length === 0 ? emptyMessage : messagesList }

        <MessageForm />
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
    options: (props) => ({
      variables: {
        id: parseInt(props.channelId)
      },
    })
  }),
  graphql(getChannelMessagesQuery, {
    options: (props) => ({
      variables: {
        channelId: parseInt(props.channelId)
      },
    })
  })
)(Messages)

export default MutationsAndQuery


