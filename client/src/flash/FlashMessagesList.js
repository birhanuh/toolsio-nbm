import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import FlashMessage from './FlashMessage'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { deleteFlashMessage } from '../actions/flashMessageActions'

class FlashMessagesList extends Component {
  render() {
    const messages = this.props.messages.map(message => 
      <FlashMessage key={message.id} message={message} deleteFlashMessage={this.props.deleteFlashMessage}/>
    )

    return (
      <div className={classnames({'sixteen wide column flash-message': messages.length !== 0})}>{messages}</div>
    )
  }
}

// Proptypes definition
FlashMessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}

// Takes our global state and return just flashMessages
function mapStateToProps(state) {
  return {
    messages: state.flashMessages
  }
}

export default connect(mapStateToProps, { deleteFlashMessage })(FlashMessagesList)