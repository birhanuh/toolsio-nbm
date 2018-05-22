import React, { Component } from 'react'
import { Comment } from 'semantic-ui-react'
import { Button, Modal, Message } from 'semantic-ui-react'
import MessageForm from './Form/Message'
import UsersForm from './Form/Users'
import RenderText from '../RenderText'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { GET_CHANNEL_QUERY, GET_CHANNEL_MESSAGE_QUERY } from '../../../graphql/messages'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

import $ from 'jquery'

import avatarPlaceholderSmall from '../../../images/avatar-placeholder-small.png'

const NEW_CHANNEL_MESSAGE_SUBSCRIPTION = gql`
  subscription($channelId: Int!) {
    getNewChannelMessage(channelId: $channelId) {
      id
      body
      uploadPath
      mimetype
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

const AddChannelModal = ({ open, onClose, channelId }) => (
  <Modal
    className="ui small modal add-member"
    open={open}
    onClose={(e) => {
      onClose(e)
    }}
  >
    <Modal.Header>{T.translate("conversations.messages.add_member")}</Modal.Header>
    <Modal.Content>
      <UsersForm channelId={channelId} onClose={onClose} />
    </Modal.Content>
    <Modal.Actions>
      <Button
        onClick={(e) => {
          onClose(e)
        }}
      >
        {T.translate("conversations.form.cancel")}
      </Button>
     </Modal.Actions>
  </Modal>
)

const MessageTypes = ({ message: {uploadPath, body, mimetype} }) => {
  
  if (uploadPath) {
    if (mimetype.startsWith('image/')) {
      return (<div className="ui small message img">
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

  state = {
    openAddChannelModal: false
  }

  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.channelId)

    // Scrolle bottom
    $(".comments").animate({ scrollTop: $(document).height() }, "slow")
  }

  componentWillReceiveProps({ channelId }) {    
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      this.unsubscribe = this.subscribe(channelId)
    }
  }﻿

  componentWillUnmount() {   
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }﻿

  subscribe = (channelId) => 
    this.props.getChannelMessagesQuery.subscribeToMore({
      document: NEW_CHANNEL_MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: parseInt(channelId)
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        console.log('subscriptionData.data', subscriptionData.data)
        return {
          ...prev,
          getChannelMessages: [...prev.getChannelMessages, subscriptionData.data.getNewChannelMessage],
        }
      }
    })
  

  toggleAddChannelModal = (e) => {
    if (e) {
      e.preventDefault()  
    }
    
    this.setState(state => ({ openAddChannelModal: !state.openAddChannelModal }))
  }

  render() {
    const { openAddChannelModal } = this.state
    
    const { getChannelQuery: { getChannel }, getChannelMessagesQuery: { getChannelMessages } } = this.props

    const emptyMessage = (
      <Message info>
        <Message.Header><h3>{T.translate(`conversations.messages.empty_message_header`)}</h3></Message.Header>
        <p>{T.translate(`conversations.messages.empty_channel_message_message`)}</p>
      </Message>
    )

    const messagesList = getChannelMessages && getChannelMessages.map(message => 
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

    return [
      <div key="channel-messages" className="messages"> 
        <div className="ui clearing vertical segment p-0">
          <h3 className="ui left floated header capitalize mt-2">
            {getChannel && getChannel.name}           
          </h3> 
          <button id="add-member" className="ui right floated primary outline small button" onClick={this.toggleAddChannelModal.bind(this)}>
            <i className="add circle icon"></i>
            {T.translate("conversations.messages.add_member")}
          </button> 
        </div>

        <div className="ui divider"></div> 

        <Comment.Group>
          { getChannelMessages && getChannelMessages.length === 0 ? emptyMessage : messagesList }
        </Comment.Group>   
        
        <MessageForm channelId={this.props.channelId} />
      </div>,
      <AddChannelModal
        onClose={this.toggleAddChannelModal.bind(this)}
        open={openAddChannelModal}
        key="add-channel-modal"
        channelId={this.props.channelId}
      />
    ] 
  }
}

const Queries =  compose(
  graphql(GET_CHANNEL_QUERY, {
    "name": "getChannelQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.channelId)
      }
    })
  }),
  graphql(GET_CHANNEL_MESSAGE_QUERY, {
    "name": "getChannelMessagesQuery",
    options: (props) => ({
      variables: {
        channelId: parseInt(props.channelId)
      },
      fetchPolicy: 'network-only'
    })
  })
)(Messages)

export default Queries


