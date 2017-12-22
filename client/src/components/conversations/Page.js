import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchConversations } from '../../actions/conversationActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchConversations()
  }

  render() {
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

            <a className="active item">
              <div className="ui small label">12</div>
              <i className="inbox outline icon"></i>
              {T.translate("conversations.page.inbox")}
            </a>
            <a className="item">
              <div className="ui small label">1</div>
              <i className="send outline icon"></i>
              {T.translate("conversations.page.sent")}
            </a>
            <a className="item">
              <div className="ui small label">1</div>
              <i className="trash outline icon"></i>
              {T.translate("conversations.page.trash")}
            </a>
            <a className="item">
              <div className="ui small label">1</div>
              <i className="copy outline icon"></i>
              {T.translate("conversations.page.draft")}
            </a>
          </div>
        </div>
        <div className="twelve wide stretched column">
          <div className="ui segment">

            <List conversations={this.props.conversations} />   
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

export default connect(mapSateToProps, { fetchConversations })(Page)

