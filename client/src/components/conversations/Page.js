import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import List from './List' 
import { connect } from 'react-redux'
import { fetchConversations, deleteConversation } from '../../actions/conversationActions'

// jQuery
import $ from 'jquery'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

    // Fetch Inbox or sent by seeing what's present in params
    const { match } = this.props
   
    if (match.params.type === 'sent') {
      this.props.fetchConversations('sent')
    } else {
      this.props.fetchConversations('inbox')
    }

    $('#draft').on('click', function() {
      console.log('Draft clicked')
    })

  }

  render() {
    
    const { match } = this.props

    return (

      <div className="ui grid">
        <div className="four wide column">
          <div className="ui vertical fluid menu">

            <div className="ui center aligned vertical segment">
              <Link className="ui primary small button" to="/conversations/new">
                <i className="edit outline icon"></i>
                {T.translate("conversations.page.compose_new_conversation")}
              </Link>
            </div>
            
            <div className="ui divider mt-0"></div>

            <Link to="/conversations/inbox" className={classnames('item', {active: (match.params.type === "inbox" || typeof match.params.type === "undefined")})}>
              <div className="ui small label">12</div>
              <i className="inbox outline icon"></i>
              {T.translate("conversations.page.inbox")}
            </Link>
            <Link to="/conversations/sent" className={classnames('item', {active: match.params.type === "sent"})}>
              <div className="ui small label">1</div>
              <i className="send outline icon"></i>
              {T.translate("conversations.page.sent")}
            </Link>
            <Link to="/conversations/draft" id="draft" className={classnames('item', {active: match.params.type === "draft"})}>
              <div className="ui small label">1</div>
              <i className="copy outline icon"></i>
              {T.translate("conversations.page.draft")}
            </Link>
          </div>
        </div>
        <div className="twelve wide stretched column">
          <div className="ui segment">

            <List conversations={this.props.conversations} deleteConversation={deleteConversation} />   
          </div>
        </div>
      </div> 
    )
  }
}

Page.propTypes = {
  fetchConversations: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    conversations: state.conversations
  }
}

export default connect(mapSateToProps, { fetchConversations, deleteConversation })(Page)

