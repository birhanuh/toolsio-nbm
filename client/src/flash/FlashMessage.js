import React, { Component } from 'react' 
import classnames from 'classnames'

class FlashMessage extends Component {
  
  onClick() {
    this.props.deleteFlashMessage(this.props.message.id)
  }

  render() {
    const { type, text } = this.props.message
    return (
      <div className={classnames('alert', {
        'alert-success': type === 'success',
        'alert-danger': type === 'error'
      })}>
        <button onClick={this.onClick.bind(this)} className="close"><span>&times;</span></button>
        {text}
      </div>
    )
  }
}

// Proptypes definition
FlashMessage.propTypes = {
  message: React.PropTypes.object.isRequired,
  deleteFlashMessage: React.PropTypes.func.isRequired
}

export default FlashMessage