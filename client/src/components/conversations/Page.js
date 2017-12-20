import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchMessages } from '../../actions/conversatoinActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchMessages()
  }

  render() {
    return (
      <div className="row column">  
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/messages/new">
            <i className="add circle icon"></i>
            {T.translate("messages.page.add_new_message")}
          </Link>
        </div>  

        <List messages={this.props.messages} />   
      </div>  
    )
  }
}

Page.propTypes = {
  fetchMessages: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    messages: state.messages
  }
}

export default connect(mapSateToProps, { fetchMessages })(Page)

