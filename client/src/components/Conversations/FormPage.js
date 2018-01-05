import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createConversation } from '../../actions/conversationActions'
import { fetchUsers } from '../../actions/userActions'

import Form from './Form'

// Localization 
import T from 'i18n-react'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    this.props.fetchUsers()
  }

  createConversation = ({ recipientId, title, body }) => {     
    return this.props.createConversation({ recipientId, title, body })
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
          <Form users={this.props.users} createConversation={this.createConversation} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createConversation: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  return { 
    users: state.users
  }
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { createConversation, fetchUsers })(FormPage)


