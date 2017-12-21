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
          <div className="ui vertical fluid tabular menu">

            <div className="ui center aligned vertical segment">
              <Link className="ui primary small button" to="/conversations/new">
                <i className="edit outline icon"></i>
                {T.translate("conversations.page.compose_new_conversation")}
              </Link>
            </div>
            
            <div className="ui divider mt-0"></div>

            <a className="active item">
              Bio
            </a>
            <a className="item">
              Pics
            </a>
            <a className="item">
              Companies
            </a>
            <a className="item">
              Links
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

