import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route, Switch } from 'react-router-dom'
import classnames from 'classnames' 
import { connect } from 'react-redux'
import { fetchConversations, fetchInboxOrSent, deleteConversation } from '../../actions/conversationActions'

import List from './List'
import Show from './Show'
import FormPage from './FormPage'

// jQuery
import $ from 'jquery'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  constructor(props) {
    super(props) 
    this.state = {
      countUnread: this.props.conversations.countUnread,
      countDraft: this.props.conversations.countDraft,
      conversations: this.props.conversations.conversations
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.conversations) {
      this.setState({
        countUnread: nextProps.conversations.countUnread,
        countDraft: nextProps.conversations.countDraft,
        conversations: nextProps.conversations.conversations
      })
    }
  }

  componentDidMount() {

    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })   

    $('#draft').on('click', function() {
      console.log('Draft clicked')
    })

    // Fetch Inbox or sent by seeing what's present in params
    const { match } = this.props
    
    if (match.params.type === 'inbox' && !match.params.id) {
      this.props.fetchInboxOrSent('inbox')
      console.log('inbox')
    } else if (match.params.type === 'sent' && !match.params.id) {
      this.props.fetchInboxOrSent('sent')
      console.log('sent')
    } else if (!match.params.id) {
      this.props.fetchConversations()
      console.log('undefined')
    }

  }

  render() {
    
    const { countUnread, countDraft, conversations } = this.state
    const { match } = this.props

    let countUnreadElement
    let countDraftElement

    if (countUnread !== 0) {
      countUnreadElement = <div className="ui small blue label">{countUnread}</div>  
    } else {
      countUnreadElement = <div></div>
    }

    if (countDraft !== 0) {
      countDraftElement = <div className="ui small green label">{countDraft}</div>  
    } else {
      countDraftElement = <div></div>
    }

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
              
              {countUnreadElement}

              <div>
                <i className="inbox outline icon"></i>&nbsp;
                {T.translate("conversations.page.inbox")}
              </div>
            </Link>
            <Link to="/conversations/sent" className={classnames('item', {active: match.params.type === "sent"})}>
              <div>
                <i className="send outline icon"></i>&nbsp;
                {T.translate("conversations.page.sent")}
              </div>
            </Link>
            <Link to="/conversations/draft" id="draft" className={classnames('item', {active: match.params.type === "draft"})}>

              {countDraftElement}

              <div>
                <i className="copy outline icon"></i>&nbsp;
                {T.translate("conversations.page.draft")}
              </div>
            </Link>
          </div>
        </div>
        <div className="twelve wide stretched column">
          <div className="ui segment">

            <Switch>
              {conversations && <Route exact path="/conversations" children={() =>
                <List conversations={conversations} deleteConversation={deleteConversation} account={this.props.account} />
              } />}

              <Route exact path="/conversations/new" component={FormPage} /> 
              
              {conversations && <Route exact path="/conversations/:type" children={() =>
                <List conversations={conversations} deleteConversation={deleteConversation} account={this.props.account} />
              } />}

              <Route exact path="/conversations/:type/show/:id" render={(props) => 
                <Show conversations={conversations} {...props} /> 
              } />
            </Switch>


          </div>
        </div>
      </div> 
    )
  }
}

Page.propTypes = {
  fetchConversations: PropTypes.func.isRequired,
  fetchInboxOrSent: PropTypes.func.isRequired,
  deleteConversation: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  
  return {
    conversations: state.conversations,
    account: state.authentication.account
  }
}

export default connect(mapSateToProps, { fetchConversations, fetchInboxOrSent, deleteConversation }) (Page)

