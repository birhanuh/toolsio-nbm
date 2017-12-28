import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TextAreaField } from '../../utils/FormFields'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { fetchConversation, deleteConversation } from '../../actions/conversationActions'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

// Images
import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

class Show extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      conversationId: null,
      recipientId: '',
      title: '',
      body: '',
      conversation: this.props.conversation ? this.props.conversation : []
    }
  }

  componentDidMount = () => {
    // Fetch Conversation when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchConversation(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.conversation) {
      this.setState({
        conversation: nextProps.conversation
      })
    }
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.conversation').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.conversation').modal('hide')
  }

  handleChange = (e) => {

   
  }

  handleReply(event) {
    event.preventDefault()
    
  }

  handleDelete(id, event) {
    event.preventDefault()
    
    let name = this.state.name

    this.props.deleteConversation(id).then(
      () => {
        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("conversations.show.flash.success_delete", { name: name})
        })  
        this.context.router.history.push('/conversations')
      },
      ({ response }) => {
      }
    ) 
    
  }

  render() {
    const { conversationId, recipientId, body, conversation } = this.state

    const messageList = conversation.map(message => 
      <div key={message._id} className="comment">
        <h3 className="ui header">{message.title}</h3>
        <a className="avatar">
          <img className="ui avatar image" src={avatarPlaceholderSmall} alt="avatar-placeholder-small" />
        </a>
        <div className="content">
          <a className="author">{message.author.firstName}</a>
          <div className="metadata">
            <span className="date">{message.createdAt}</span>
          </div>
          <div className="text">{message.body}</div>
          <div className="actions">
            <a className="reply">Reply</a>
          </div>
        </div>
        <div className="ui divider"></div> 
      </div>
      )

    return (
      <div className="p-3">    
        <div className="ui comments mb-5">
          
          {messageList}

          <form className="ui reply form">
            <TextAreaField
              label=""
              name="description" 
              value={body} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("conversations.show.write_reply")}
              formClass="field"
            />
            <button className="ui primary small button" onClick={this.handleReply.bind(this)}><i className="edit icon"></i>{T.translate("conversations.show.reply")}</button>
          </form>
        </div>
        
        <div className="ui divider mt-5"></div>  

        <button className="ui negative button mt-3" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("conversations.show.delete")}</button>


        <div className="ui small modal conversation">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("conversations.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("conversations.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, conversationId)}>{T.translate("conversations.show.delete")}</button>
          </div>
        </div>

      </div>       
    )
  }
}

Show.propTypes = {
  fetchConversation: PropTypes.func.isRequired,
  deleteConversation: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      conversation: state.conversations.find(item => item.length !==0 && item[0].conversationId === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchConversation, deleteConversation, addFlashMessage } )(Show)
