import React, { Component } from 'react'
// Semantic UI Form elements
import { Segment, Comment, Message, Header, Modal, Image, Button } from 'semantic-ui-react'
import { Image as CloudinaryImage } from 'cloudinary-react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { GET_DIRECT_MESSAGES_QUERY, MARK_DIRECT_MESSAGES_AS_READ_MUTATION, GET_USER_QUERY, GET_UNREAD_DIRECT_MESSAGES_COUNT_SENDER_QUERY } from '../../../graphql/conversations/directMessages'

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

const ShowInModal = ({ trigger, src, mimetype }) => {
  let content
  
  if (mimetype.startsWith('image/')) {
    content = (<Modal.Content scrolling image>
        <Image wrapped src={src} />
      </Modal.Content>)
  } else if (mimetype.startsWith('audio/')) {
      content = (<Modal.Content>
          <Modal.Description>
            <audio controls>
              <source src={src} />
            </audio></Modal.Description>
        </Modal.Content>)
    } else if (mimetype.startsWith('video/')) {
      content = (<Modal.Content>
          <Modal.Description>
            <video controls>
              <source src={src} />
            </video>
          </Modal.Description>
        </Modal.Content>)
    }

  return (<Modal trigger={trigger} className="messages">
    {content}
  </Modal>)
}

const MessageTypes = ({ message: {uploadPath, body, mimetype} }) => {
  
  if (uploadPath) {
    if (mimetype.startsWith('image/')) {
      return (<div className="ui small message img">
        <ShowInModal trigger={<img src={uploadPath} alt={`${uploadPath}-avatar-url-small`} />} src={uploadPath} mimetype={mimetype} />
      </div>)
    } else if (mimetype.startsWith('audio/')) {
      return (<ShowInModal 
        trigger={<div className="ui small message audio"><audio controls>
          <source src={uploadPath} type={mimetype} />
        </audio></div>} 
        src={uploadPath} 
        mimetype={mimetype} />)
    } else if (mimetype.startsWith('video/')) {
      return (<ShowInModal 
        trigger={<div className="ui small message video"><video controls>
          <source src={uploadPath} type={mimetype} />
        </video></div>} 
        src={uploadPath} 
        mimetype={mimetype} />)
    } else if (mimetype.startsWith('text/')) {
      return (<div className="ui small message pre">
          <RenderText uploadPath={uploadPath} />
          <div className="buttons">
            <Button basic size="small" icon='download' />
            <a href={uploadPath} target="_blank" className="ui icon basic small button"><i className="external icon"></i></a>
          </div>
        </div>)
    } else { // For all rest file types (E.g. text, pdf, doc...()
       return (<div className="ui small message pre">
          <pre>{uploadPath}</pre>
          <div className="buttons">
            <Button basic size="small" icon='download' />
            <a href={uploadPath} target="_blank" className="ui icon basic small button"><i className="external icon"></i></a>
          </div>
        </div>) 
    }
  }
  return (body)            
}

class Messages extends Component {

  state = {
    hasMoreItems: true
  }

  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.receiverId)

    // Mark messages as unread for this reciever
    this.props.markDirectMessagesAsReadMutation({ 
        variables: { senderId: parseInt(this.props.receiverId) },
        update: (store) => {
          const data = store.readQuery({ query: GET_UNREAD_DIRECT_MESSAGES_COUNT_SENDER_QUERY })
          
          const updatedUnreadDirectMessagesCountSender = data.getUnreadDirectMessagesCountSender.unreadDirectMessagesCountSender.map(item => {
            if (item.sender_id === parseInt(this.props.receiverId)) {
              return {...item, count: 0}
            }
            return item
          })
      
          data.getUnreadDirectMessagesCountSender.unreadDirectMessagesCountSender = updatedUnreadDirectMessagesCountSender

          // Write our data back to the cache.
          store.writeQuery({ query: GET_UNREAD_DIRECT_MESSAGES_COUNT_SENDER_QUERY, data })
        }
      })
      //.then(res => console.log('res: ', res.data.markDirectMessagesAsRead)) // Redundant for this usecase 
      .catch(err => console.log('err: ', err))
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
    this.props.data.subscribeToMore({
      document: NEW_DIRECT_MESSAGE_SUBSCRIPTION,
      variables: {
        receiverId: parseInt(receiverId)
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('getDirectMessages', subscriptionData)
        if (!subscriptionData.data) return prev

        return {
          ...prev,
          getDirectMessages: [subscriptionData.data.getNewDirectMessage, ...prev.getDirectMessages]
        }
      }
    })

  handleScroll = () => {
    const { data: { getDirectMessages, fetchMore }, receiverId } = this.props

    if (this.scroller && this.scroller.scrollTop === 0 && 
      (this.state.hasMoreItems) && (getDirectMessages && getDirectMessages.length >= 10)) {
      
      fetchMore({
        variables: {
          receiverId: parseInt(receiverId),
          cursor: getDirectMessages[getDirectMessages.length - 1].createdAt
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          if (fetchMoreResult.getDirectMessages.length < 10) {
            this.setState({ hasMoreItems: false })
          }
          
          return Object.assign({}, prev, {
            getDirectMessages: [...prev.getDirectMessages, ...fetchMoreResult.getDirectMessages]
          })
        }
      })
    }
  }

  render() {

    const { getUserQuery: { getUser }, data: { getDirectMessages }, receiverId } = this.props

    const emptyMessage = (
      <Message info>
        <Message.Header><h3>{T.translate(`conversations.messages.empty_message_header`)}</h3></Message.Header>
        <p>{T.translate(`conversations.messages.empty_direct_message_message`)}</p>
      </Message>
    )

    const messagesList = getDirectMessages && getDirectMessages.map(message => 
      <Comment key={message.id}>
        <div className="avatar">
            {message.user.avatarUrl ? <CloudinaryImage cloudName="toolsio" publicId={message.user.avatarUrl} gravity="face" width="50" height="50" crop="thumb" /> : 
              <Image src={avatarPlaceholderSmall} alt="avatarPlaceholderSmall" /> }
        </div>
        <Comment.Content>
          <Comment.Author as="a">{message.user.email}</Comment.Author>
          <Comment.Metadata>
            <div>{moment(message.createdAt).format('llll') }</div>
          </Comment.Metadata>
          <Comment.Text>
           
           <MessageTypes message={message} />
          </Comment.Text>
        </Comment.Content>
      </Comment>
    )

    return (
      <div className="messages">
        <Segment vertical clearing>
          <Header as='h3' dividing className="capitalize">{getUser && getUser.firstName}</Header>
        </Segment>        
        {/*
        { (this.state.hasMoreItems) && (getDirectMessages && getDirectMessages.length >= 10) &&
          <div className="ui center aligned basic segment pt-0">       
            <Button 
              primary
              size="small" 
              icon
              disabled={!this.state.hasMoreItems} 
              onClick={() => {
                fetchMore({
                  variables: {
                    receiverId: parseInt(receiverId),
                    cursor: getDirectMessages[getDirectMessages.length - 1].createdAt
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev

                    if (fetchMoreResult.getDirectMessages.length < 5) {
                      this.setState({ hasMoreItems: false })
                    }
                    
                    return Object.assign({}, prev, {
                      getDirectMessages: [...prev.getDirectMessages, ...fetchMoreResult.getDirectMessages]
                    })
                  }
                })
              }}
            >
              <Icon name='refresh' />&nbsp;
              {T.translate("conversations.direct_messages.load_more")}
            </Button>
          </div>
        }
        */}
         <div onScroll={this.handleScroll}
          ref={(scroller) => {
            this.scroller = scroller
          }}>
          <Comment.Group>
            { getDirectMessages && getDirectMessages.length === 0 ? emptyMessage : messagesList }
          </Comment.Group>           
        </div>
          
        <MessageForm receiverId={receiverId} />
      </div>
    ) 
  }
}

const QueriesMutation =  compose(
  graphql(MARK_DIRECT_MESSAGES_AS_READ_MUTATION, {
    name: 'markDirectMessagesAsReadMutation'
  }),
  graphql(GET_USER_QUERY, {
    "name": "getUserQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.receiverId)
      }
    })
  }),
  graphql(GET_DIRECT_MESSAGES_QUERY, {
    options: (props) => ({
      variables: {
        receiverId: parseInt(props.receiverId)
      },
      fetchPolicy: 'network-only'
    })
  })
)(Messages)

export default QueriesMutation


