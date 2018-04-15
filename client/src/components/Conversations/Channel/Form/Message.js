import React, { Component } from 'react' 
import classnames from 'classnames'
import Dropzone from 'react-dropzone'
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
      body: '',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.channelId) {
      this.setState({
        channelId: nextProps.channelId
      })
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
    
    const { body } = this.state
    
    // Validation
    if (e.keyCode === ENTER_KEY) { 
      if (!body.trim()) { 
        return
      } else {
        const { channelId, body } = this.state

        this.setState({ isLoading: true })

        this.props.mutate({ 
          variables: { body, channelId: parseInt(channelId) }
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
                "body": ''
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

  handleOnDrop = async ([file]) => {

    const { channelId, body } = this.state
    this.setState({ isLoading: true })
    
    console.log('file: ', file)    
    await this.props.mutate({ 
      variables: { file, channelId: parseInt(channelId) },
      })
      .then(res => {       

        const { success, message, errors } = res.data.createMessage

        if (success) {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("conversations.form.flash.success_compose")
          // })  
          console.log('Message sent', message)
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

  render() {
    const { body, errors, isLoading } = this.state

    return (  

      <div className={classnames("ui form", { loading: isLoading })} >

        { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }
        
        <div className="ui fluid action input">
            <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui primary button">
              <i className="plus icon" aria-hidden="true" />  
            </Dropzone>
          
          <TextAreaField
            label=""
            name="body" 
            value={body} 
            onChange={this.handleChange.bind(this)} 
            onKeyDown={this.handleSubmit.bind(this)}
            placeholder={T.translate("conversations.form.message")}
            error={errors.body}
            formClass="field"
            rows="2"
          />           
        </div>   
      </div> 
    )
  }
}

const createMessageMutation = gql`
  mutation ($body: String, $file: Upload, $channelId: Int!) {
    createMessage(body: $body, file: $file, channelId: $channelId)  {
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

