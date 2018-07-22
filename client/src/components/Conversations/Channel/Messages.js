import React, { Component } from 'react'
import { Comment } from 'semantic-ui-react'
import MessageForm from './Form/Message'
import UsersForm from './Form/Users'
import RenderText from '../RenderText'
// Semantic UI Form elements
import { Modal, Message, Image, Button } from 'semantic-ui-react'
import { Image as CloudinaryImage } from 'cloudinary-react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { GET_CHANNEL_USERS_QUERY } from '../../../graphql/conversations/channels'
import { GET_CHANNEL_MESSAGE_QUERY } from '../../../graphql/conversations/channelMessages'

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

const AddUsersToChannelModal = ({ open, onClose, channelId, usersNotInChannel }) => (
  <Modal
    className="ui small modal add-member"
    open={open}
    onClose={(e) => {
      onClose(e)
    }}
  >
    <Modal.Header>{T.translate("conversations.messages.add_member")}</Modal.Header>
    <Modal.Content>
      <UsersForm channelId={channelId} usersNotInChannel={usersNotInChannel} onClose={onClose} />
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
    openAddUsersToChannelModal: false,
    hasMoreItems: true
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
    this.props.data.subscribeToMore({
      document: NEW_CHANNEL_MESSAGE_SUBSCRIPTION,
      variables: {
        channelId: parseInt(channelId)
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
            
        return {
          ...prev,
          getChannelMessages: [ subscriptionData.data.getNewChannelMessage, ...prev.getChannelMessages],
        }
      }
    })
  

  toggleAddUsersToChannelModal = (e) => {
    if (e) {
      e.preventDefault()  
    }
    
    this.setState(state => ({ openAddUsersToChannelModal: !state.openAddUsersToChannelModal }))
  }

  handleScroll = () => {
    const { data: { getChannelMessages, fetchMore }, receiverId } = this.props

    if (this.scroller && this.scroller.scrollTop === 0 && 
      (this.state.hasMoreItems) && (getChannelMessages && getChannelMessages.length >= 10)) {
      
      fetchMore({
        variables: {
          receiverId: parseInt(receiverId),
          cursor: getChannelMessages[getChannelMessages.length - 1].createdAt
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          if (fetchMoreResult.getChannelMessages.length < 10) {
            this.setState({ hasMoreItems: false })
          }
          
          return Object.assign({}, prev, {
            getChannelMessages: [...prev.getChannelMessages, ...fetchMoreResult.getChannelMessages]
          })
        }
      })
    }
  }

  render() {
    const { openAddUsersToChannelModal } = this.state
    
    const { getChannelQuery: { getChannel }, data: { getChannelMessages } } = this.props

    const emptyMessage = (
      <Message info>
        <Message.Header><h3>{T.translate(`conversations.messages.empty_message_header`)}</h3></Message.Header>
        <p>{T.translate(`conversations.messages.empty_channel_message_message`)}</p>
      </Message>
    )

    const messagesList = getChannelMessages && getChannelMessages.map(message => 
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

    return [
      <div key="channel-messages" className="messages"> 
        <div className="ui clearing vertical segment p-0">
          <h3 className="ui left floated header capitalize mt-2">
            {getChannel && getChannel.name}           
          </h3> 
          <button id="add-member" className="ui right floated primary outline small button" onClick={this.toggleAddUsersToChannelModal.bind(this)}>
            <i className="add circle icon"></i>
            {T.translate("conversations.messages.add_member")}
          </button> 
        </div>

        <div className="ui divider"></div> 

        <div className="ui comments"
          onScroll={this.handleScroll}
          ref={(scroller) => {
            this.scroller = scroller
          }}
        >
          { getChannelMessages && getChannelMessages.length === 0 ? emptyMessage : messagesList }
        </div>   
        
        <MessageForm channelId={this.props.channelId} />
      </div>,
      <AddUsersToChannelModal
        onClose={this.toggleAddUsersToChannelModal.bind(this)}
        open={openAddUsersToChannelModal}
        key="add-channel-modal"
        channelId={this.props.channelId}
        usersNotInChannel={getChannel && getChannel.usersNotInChannel}
      />
    ] 
  }
}

const Queries =  compose(
  graphql(GET_CHANNEL_USERS_QUERY, {
    "name": "getChannelQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.channelId)
      }
    })
  }),
  graphql(GET_CHANNEL_MESSAGE_QUERY, {
    options: (props) => ({
      variables: {
        channelId: parseInt(props.channelId)
      },
      fetchPolicy: 'network-only'
    })
  })
)(Messages)

export default Queries


