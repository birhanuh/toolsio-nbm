import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'

class FlashMessage extends Component {
  
  onClick() {
    this.props.deleteFlashMessage(this.props.message.id)
  }

  render() {
    const { type, text } = this.props.message
    return (
      <div className={classnames('ui message', {
        'positive': type === 'success',
        'negative': type === 'error'
      })}>
        <i onClick={this.onClick.bind(this)} className="close icon"></i>
        <p>{text}</p>
      </div>
    )
  }
}

// Proptypes definition
FlashMessage.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}

export default FlashMessage