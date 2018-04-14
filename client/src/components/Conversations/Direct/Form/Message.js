import React, { Component } from 'react' 
import classnames from 'classnames'
import Dropzone from 'react-dropzone'
import { Validation } from '../../../../utils'
import { TextAreaField } from '../../../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

const ENTER_KEY = 13

class Message extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      receiverId: this.props.receiverId ? this.props.receiverId: null,
      message: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {

    if (this.state.errors[e.target.name]) {
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
        const { receiverId, message } = this.state

        this.setState({ isLoading: true })

        this.props.mutate({ 
          variables: { message, receiverId: parseInt(receiverId) },
          optimisticResponse: {
            createDirectMessage: {
              __typename: "Mutation",
              id: -1,
              success: true,
              errors: null,
              message: {
                __typename: "Message",
                id: -1,
              }
            }            
          },
          update: (store) => {
            const data = store.readQuery({ query: getDirectMessageUsersQuery })
            const notUserInList = data.getDirectMessageUsers.every(user => user.id !== parseInt(receiverId, 10))
            
            if (notUserInList) {
              data.getDirectMessageUsers.push({
                __typename: 'DirectMessageUser',
                id: parseInt(receiverId, 10),
                first_name: this.props.data.getUser.firstName,
                email: this.props.data.getUser.email
              })
            }
            // Write our data back to the cache.
            store.writeQuery({ query: getDirectMessageUsersQuery, data })
          }})
          .then(res => {           

            const { success, message, errors } = res.data.createDirectMessage

            if (success) {
              console.log('Message sent', message)
              // this.props.addFlashMessage({
              //   type: 'success',
              //   text: T.translate("conversations.form.flash.success_compose")
              // })  
              // this.context.router.history.push('/conversations')

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

  handleOnDrop = async ([file]) => {

    const { receiverId } = this.state
    this.setState({ isLoading: true })
    
    console.log('file: ', file)    
    await this.props.mutate({ 
      variables: { file, receiverId: parseInt(receiverId) },
      optimisticResponse: {
        createDirectMessage: {
          __typename: "Mutation",
          id: -1,
          success: true,
          errors: null,
          message: {
            __typename: "Message",
            id: -1,
          }
        }            
      },
      update: (store) => {
        const data = store.readQuery({ query: getDirectMessageUsersQuery })
        const notUserInList = data.getDirectMessageUsers.every(user => user.id !== parseInt(receiverId, 10))
        
        if (notUserInList) {
          data.getDirectMessageUsers.push({
            __typename: 'DirectMessageUser',
            id: parseInt(receiverId, 10),
            first_name: this.props.data.getUser.firstName,
            email: this.props.data.getUser.email
          })
        }
        // Write our data back to the cache.
        store.writeQuery({ query: getDirectMessageUsersQuery, data })
      }})
      .then(res => {            

        const { success, message, errors } = res.data.createDirectMessage

        if (success) {              
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("conversations.form.flash.success_compose")
          // })  
          // this.context.router.history.push('/conversations')
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
    const { message, errors, isLoading } = this.state

    return (  

      <div className={classnames("ui form", { loading: isLoading })} >

        { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }
        
        <div className="ui left action input">
          <Dropzone onDrop={this.handleOnDrop.bind(this)} className="ignore ui primary button">
            <i className="plus icon" aria-hidden="true" />  
          </Dropzone>
          
          <TextAreaField
            label=""
            name="message" 
            value={message} 
            onChange={this.handleChange.bind(this)} 
            onKeyDown={this.handleSubmit.bind(this)}
            placeholder={T.translate("conversations.form.message")}
            error={errors.message}
            formClass="field"
            rows="2"
          /> 
        </div> 
      </div> 
    )
  }
}

const createDirectMessageMutation = gql`
  mutation ($message: String, $file: Upload, $receiverId: Int!) {
    createDirectMessage(message: $message, file: $file, receiverId: $receiverId) {
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

const getDirectMessageUsersQuery = gql`
  {
    getDirectMessageUsers {
      id
      first_name
      email
    }
  }
`

const getUserQuery = gql`
  query getUser($id: Int!) { 
    getUser(id: $id) {
      id
      firstName
      email
    }
}
`

const MutationsAndQuery =  compose(
  graphql(createDirectMessageMutation),
  graphql(getDirectMessageUsersQuery),  
  graphql(getUserQuery, {
    options: (props) => ({
      variables: {
        id: parseInt(props.receiverId, 10)
      }
    })
  })
)(Message)

export default MutationsAndQuery

