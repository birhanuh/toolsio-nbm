import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { fetchConversation, deleteConversation } from '../../actions/conversationActions'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Show extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.message ? this.props.message._id : null,
      recipientId: this.props.message ? this.props.message.recipientId : '',
      title: this.props.message ? this.props.message.title : '',
      body: this.props.body ? this.props.message.body : ''
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
        _id: nextProps.message._id,
        recipientId: nextProps.message.recipientId,
        title: nextProps.message.title,
        body: nextProps.message.body
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
    const { _id, title, recipientId, body } = this.state

    return (
      <div className="ui stackable grid">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className="ui header">{title}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("conversations.show.recipient")}</dt>
              <dd>{recipientId}</dd>
              <dt>{T.translate("conversations.show.body")}</dt>
              <dd>{body}</dd>
            </dl>
              
            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="delete icon"></i>{T.translate("conversations.show.delete")}</button>
          </div>    
        </div>

        <div className="ui small modal conversation">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("conversations.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("conversations.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, _id)}>{T.translate("conversations.show.delete")}</button>
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
      conversation: state.conversations.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchConversation, deleteConversation, addFlashMessage } )(Show)
