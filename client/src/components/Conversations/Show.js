import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { TextAreaField } from '../../utils/FormFields'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { fetchConversation, createConversation, deleteConversation } from '../../actions/conversationActions'

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
      conversationId: this.props.conversation ? this.props.conversation.conversationId : null,
      title: this.props.conversation ? this.props.conversation.title : '',
      body: '',
      conversation: this.props.conversation ? this.props.conversation[0] : [],
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.conversation) {
      this.setState({
        conversationId: nextProps.conversation.conversationId,
        title: nextProps.conversation.title,
        conversation: nextProps.conversation[0]
      })
    }
  }

  componentDidMount = () => {
    // Fetch Conversation when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchConversation(match.params.id)
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

    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
     
    } else {

      this.setState({
        [e.target.name]: e.target.value
      })
    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateConversationReplyInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid;
  }

  handleReply = (e) => {
    e.preventDefault()
    
    // Validation
    if (this.isValid()) { 
      const { conversationId, title, body } = this.state
      this.setState({ isLoading: true })
      this.props.createConversation({ conversationId, title, body })
        .then(() => {

        })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
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
    const { conversationId, body, conversation, isLoading } = this.state
    console.log('conversation: ', conversation)
    const messageList = conversation && conversation.map(message => 
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
      <div className={classnames("p-3", { loading: isLoading })} >    
        <div className="ui comments mb-5">
          
          {messageList}

          <form className="ui reply form">
            <TextAreaField
              label=""
              name="body" 
              value={body} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("conversations.show.write_reply")}
              formClass="field"
            />
            <button disabled={isLoading} className="ui primary small button" onClick={this.handleReply.bind(this)}><i className="edit icon"></i>{T.translate("conversations.show.reply")}</button>
          </form>
        </div>
        
        <div className="ui divider mt-5"></div>  

        <button className="ui negative button mt-3" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("conversations.show.delete_conversation")}</button>


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
  createConversation: PropTypes.func.isRequired,
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
      conversation: state.conversations.conversations && state.conversations.conversations.filter(item => Array.isArray(item) && item[0].conversationId === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchConversation, createConversation, deleteConversation, addFlashMessage } )(Show)
