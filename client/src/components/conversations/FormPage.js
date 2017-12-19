import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { composeMessage, fetchRecipient } from '../../actions/conversationActions'
import Form from './Form'

// Localization 
import T from 'i18n-react'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    this.props.fetchRecipient()
  }

  sendMessage = ({ _id, title, recipient, body }) => {     
    return this.props.composeMessage({ _id, title, recipient, body })
      .then(() => 
        { 
          this.setState({ redirect: true }) 

          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("conversations.form.flash.success_compose")
          })  
          this.context.router.history.push('/conversations')
        })   
    
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/conversations" /> : 
          <Form recipients={this.props.recipients} sendMessage={this.sendMessage} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  composeMessage: PropTypes.func.isRequired,
  fetchRecipient: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return { 
    recipients: state.recipients
  }
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { composeMessage, fetchRecipient })(FormPage)


