import React, { Component } from 'react'
import { Comment, Message } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import MessageForm from './Form/Message'
import RenderText from '../RenderText'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

import avatarPlaceholderSmall from '../../../images/avatar-placeholder-small.png'

const NEW_DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription($receiverId: Int!) {
    getNewDirectMessage(receiverId: $receiverId) {
      id
      body
      uploadPath
      mimetype
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

const MessageTypes = ({ message: {uploadPath, body, mimetype} }) => {
  
  if (uploadPath) {
    if (mimetype.startsWith('image/')) {
      return (<div className="ui small message">
        <img src={uploadPath} alt={`${uploadPath}-avatar-url-small`} />
      </div>)
    } else if (mimetype.startsWith('text/')) {
      return <RenderText uploadPath={uploadPath} />
    } else if (mimetype.startsWith('audio/')) {
      return (<div className="ui small message"><audio controls>
          <source src={uploadPath} type={mimetype} />
        </audio></div>)
    } else if (mimetype.startsWith('video/')) {
      return (<div className="ui small message"><video controls>
          <source src={uploadPath} type={mimetype} />
        </video></div>)
    }
  }
  return (body)            
}

class Messages extends Component {

  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.receiverId)
  }

  componentWillReceiveProps({ receiverId }) {    
    if (this.props.receiverId !== receiverId) {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      this.unsubscribe = this.subscribe(receiverId)
    }
  }﻿

  componentWillUnmount() {   
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }﻿

  subscribe = (receiverId) => 
    this.props.getDirectMessagesQuery.subscribeToMore({
      document: NEW_DIRECT_MESSAGE_SUBSCRIPTION,
      variables: {
        receiverId: parseInt(receiverId)
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        console.log('subscriptionData.data', subscriptionData.data)
        return {
          ...prev,
          getDirectMessages: [...prev.getDirectMessages, subscriptionData.data.getNewDirectMessage],
        }
      }
    })

  render() {

    const { getUserQuery: { getUser }, getDirectMessagesQuery: { getDirectMessages } } = this.props

    const emptyMessage = (
      <Message info>
        <Message.Header><h3>{T.translate(`conversations.messages.empty_message_header`)}</h3></Message.Header>
        <p>{T.translate(`conversations.messages.empty_direct_message_message`)}</p>
      </Message>
    )

    const messagesList = getDirectMessages && getDirectMessages.map(message => 
      <Comment key={message.id}>
        <Comment.Avatar src={message.user.avatarUrl ? message.user.avatarUrl : avatarPlaceholderSmall}
          alt="avatar" />
        <Comment.Content>
          <Comment.Author as="a">{message.user.email}</Comment.Author>
          <Comment.Metadata>
            <div>{moment(message.createdAt).format('DD/MM/YYYY')}</div>
          </Comment.Metadata>
          <Comment.Text>
           
           <MessageTypes message={message} />
          </Comment.Text>
        </Comment.Content>
      </Comment>
    )

    return (
      <div className="messages">
        <div className="ui clearing vertical segment">
          <h3 className="ui dividing header capitalize">{getUser && getUser.firstName}</h3>
        </div>
          
        <Comment.Group>
          { getDirectMessages && getDirectMessages.length === 0 ? emptyMessage : messagesList }
        </Comment.Group>   
        
        <MessageForm receiverId={this.props.receiverId} />
      </div>
    ) 
  }
}

const getUserQuery = gql`
  query getUser($id: Int!) {
    getUser(id: $id) {
      id
      firstName
      email
    }
  }
`

const getDirectMessagesQuery = gql`
  query getDirectMessages($receiverId: Int!) {
    getDirectMessages(receiverId: $receiverId) {
      id
      body
      uploadPath
      mimetype
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

const Queries =  compose(
  graphql(getUserQuery, {
    "name": "getUserQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.receiverId)
      }
    })
  }),
  graphql(getDirectMessagesQuery, {
    "name": "getDirectMessagesQuery",
    options: (props) => ({
      variables: {
        receiverId: parseInt(props.receiverId)
      },
      fetchPolicy: 'network-only'
    })
  })
)(Messages)

export default Queries


