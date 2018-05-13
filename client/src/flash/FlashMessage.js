import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { deleteFlashMessage } from '../actions/flashMessageActions'

class FlashMessage extends Component {
  
  onClick() {
    this.props.deleteFlashMessage(this.props.message.id)
  }

  render() {
    
    const { type, text } = this.props.message

    const message = (
      <div className={classnames('ui message', {
        'positive': type === 'success',
        'negative': type === 'error'
      })}>
        <i onClick={this.onClick.bind(this)} className="close icon"></i>
        <p>{text}</p>
      </div>
      )
    return (
      <div className="column row p-2">
        <div className={classnames({'sixteen wide column flash-message': !!type && !!text })}>
          {!!type && !!text && message } 
        </div>
      </div>
    )
  }
}

// Proptypes definition
FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}

// Takes our global state and return just flashMessages
function mapStateToProps(state) {
  return {
    message: state.flashMessage
  }
}

export default connect(mapStateToProps, { deleteFlashMessage } ) (FlashMessage)
