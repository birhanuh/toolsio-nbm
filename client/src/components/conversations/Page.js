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
      <div className="row column">  
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/conversations/new">
            <i className="add circle icon"></i>
            {T.translate("conversations.page.add_new_conversation")}
          </Link>
        </div>  

        <List conversations={this.props.conversations} />   
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

