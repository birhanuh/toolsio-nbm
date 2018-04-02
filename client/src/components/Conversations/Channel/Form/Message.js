import React, { Component } from 'react' 
import classnames from 'classnames'
import { Validation } from '../../../../utils'
import { TextAreaField } from '../../../../utils/FormFields'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

const ENTER_KEY = 13

class Message extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      channelId: this.props.channelId ? this.props.channelId: null,
      message: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {

    if (!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
     
    } else {

      this.setState({
        [e.target.name]: e.target.value
      })
    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateConversationInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid
  }

  handleSubmit = (e) => {
    
    const { message } = this.state
    
    // Validation
    if (e.keyCode === ENTER_KEY) { 
      if (!message.trim()) { 
        return
      } else {
        const { channelId, message } = this.state

        this.setState({ isLoading: true })

        this.props.mutate({ 
          variables: { message, channelId: parseInt(channelId) }
          })
          .then(res => {
            // this.props.addFlashMessage({
            //   type: 'success',
            //   text: T.translate("conversations.form.flash.success_compose")
            // })  
            // this.context.router.history.push('/conversations')
            

            const { success, message, errors } = res.data.createMessage

            if (success) {
              console.log('Message sent', message)
              // Rest message state
              this.setState({
                "message": ''
              })

              // Reset reload
              this.setState({ isLoading: false })
            } else {
              let errorsList = {}
              errors.map(error => errorsList[error.path] = error.message)

              this.setState({ errors: errorsList, isLoading: false })
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }))
      }
    }
  }

  render() {
    const { message, errors, isLoading } = this.state

    return (  

      <div className={classnames("ui form", { loading: isLoading })} >

        { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }
        
        <TextAreaField
          label={T.translate("conversations.form.message")}
          name="message" 
          value={message} 
          onChange={this.handleChange.bind(this)} 
          onKeyDown={this.handleSubmit.bind(this)}
          placeholder={T.translate("conversations.form.message")}
          error={errors.message}
          formClass="field"
        /> 

      </div> 
    )
  }
}

const createMessageMutation = gql`
  mutation ($message: String!, $channelId: Int!) {
    createMessage(message: $message, channelId: $channelId ) {
      success
      message {
        id
      } 
      errors {
        path
        message
      }
    }
  }
`

export default graphql(createMessageMutation)(Message)

